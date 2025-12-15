# Database Design: Observability Platform

Based on your requirements and the high-volume nature of observability data (traces/metrics) vs. the transactional nature of configuration (users/prompts), we will use a **Hybrid Architecture**:
- **PostgreSQL (OLTP)**: For stateful data, configurations, user management, and low-volume structured entities.
- **ClickHouse (OLAP)**: For high-volume immutable telemetry, aggregated metrics, and fast analytical queries.

Since you are using **Langfuse** for the backend traces engine, this design aligns with their v2 architecture, ensuring compatibility while extending it for your specific features (MCP, Insights Tower).

---

## 1. PostgreSQL Schema (Relational & State)
**Database**: `observability_db`
**Purpose**: System of record for configuration, state, and reliable transactions.

### Core & Auth
| Table | Description |
|-------|-------------|
| `organizations` | Tenants/Workspaces. |
| `users` | User accounts and rbac roles. |
| `api_keys` | Keys for ingestion authentication. |

### Feature: MCP Tool Integration `[New]`
| Table Name: `mcp_servers` | |
|:---|:---|
| `id` | UUID (PK) |
| `name` | Varchar |
| `type` | Varchar (`stdio`, `sse`) |
| `uri` | Varchar (Connection string/path) |
| `status` | Varchar (`connected`, `error`, `disconnected`) |
| `config` | JSONB (Environment vars, args) |
| `last_heartbeat` | Timestamp |

| Table Name: `mcp_tools` | |
|:---|:---|
| `id` | UUID (PK) |
| `server_id` | UUID (FK -> mcp_servers) |
| `name` | Varchar (Tool name) |
| `schema` | JSONB (Input schema) |
| `enabled` | Boolean |

### Feature: AI Insights Tower `[New]`
This requires state management (tracking alert status over time).
| Table Name: `insights_incidents` | |
|:---|:---|
| `id` | UUID (PK) |
| `title` | Varchar |
| `severity` | Varchar (`critical`, `warning`) |
| `status` | Varchar (`active`, `investigating`, `resolved`) |
| `root_cause_analysis` | Text (AI generated summary) |
| `detected_at` | Timestamp |
| `resolved_at` | Timestamp |
| `affected_trace_ids` | JSONB (List of trace IDs related to this incident) |

### Feature: Prompts
| Table Name: `prompts` | |
|:---|:---|
| `id` | UUID (PK) |
| `name` | Varchar |
| `version` | Integer |
| `template` | Text |
| `config` | JSONB (Model params: temp, top_p) |
| `input_schema` | JSONB |
| `labels` | JSONB (Tags) |

### Feature: Evaluation Configs
Only the *definitions* live here. The results live in ClickHouse.
| Table Name: `evaluation_templates` | |
|:---|:---|
| `id` | UUID (PK) |
| `name` | Varchar |
| `metric_type` | Varchar (`hallucination`, `toxicity`) |
| `provider` | Varchar (`llm-judge`, `heuristic`) |

---

## 2. ClickHouse Schema (Telemetry & Analytics)
**Database**: `observability_analytics`
**Purpose**: Ingesting high-velocity logs/traces and performing aggregate queries (P95 latency, total cost, error rates).

### Feature: Traces & Observations (Langfuse Compatible)
We store immutable events here using `MergeTree` engines for blistering fast reads.

```sql
-- The main parent trace
CREATE TABLE traces (
    id String,
    timestamp DateTime64(6),
    name String,
    user_id String,
    metadata Map(String, String),
    tags Array(String),
    input String, -- Can be large
    output String, -- Can be large
    total_token_count Int32,
    input_cost Float64,
    output_cost Float64,
    total_cost Float64,
    latency Float64, -- Seconds
    status String, -- 'success', 'error'
    release String -- Deployment version
) ENGINE = MergeTree()
ORDER BY (toStartOfHour(timestamp), user_id, timestamp);
```

```sql
-- Granular steps within a trace (LLM calls, DB calls, etc)
CREATE TABLE observations (
    id String,
    trace_id String,
    parent_observation_id String,
    type String, -- 'generation', 'span', 'event'
    name String,
    start_time DateTime64(6),
    end_time DateTime64(6),
    model String,
    model_parameters Map(String, String),
    input String,
    output String,
    tokens_prompt Int32,
    tokens_completion Int32,
    level String -- 'DEBUG', 'DEFAULT', 'WARNING', 'ERROR'
) ENGINE = MergeTree()
ORDER BY (trace_id, start_time);
```

### Feature: Evaluation Results
Scores are "events" attached to traces.
```sql
CREATE TABLE scores (
    id String,
    trace_id String,
    observation_id String,
    timestamp DateTime64(6),
    name String, -- e.g., 'faithfulness'
    value Float64, -- e.g., 0.95
    comment String, -- AI reasoning
    source String -- 'model-eval', 'user-feedback'
) ENGINE = MergeTree()
ORDER BY (timestamp, name);
```

## 3. Data Flow Strategy

1.  **Ingestion**:
    *   SDK sends event -> **FastAPI Backend**.
    *   Backend validates API key (Postgres).
    *   Backend pushes event to **ClickHouse Buffer** (or direct insert) for Traces/Observations.

2.  **Aggregation (Graphs)**:
    *   User asks "Show avg latency per model last 24h".
    *   Backend queries **ClickHouse**: `SELECT model, avg(latency) FROM observations WHERE type='generation' AND start_time > now() - 24h GROUP BY model`.

3.  **Insights Tower (Hybrid)**:
    *   A background worker (e.g., Celery/Temporal) runs distinct queries on **ClickHouse** every 5 mins (e.g., `count() where status='error' > threshold`).
    *   If threshold breached -> Create row in **Postgres** `insights_incidents`.
    *   UI reads incidents from Postgres.

4.  **MCP Integration**:
    *   Frontend reads `mcp_servers` from **Postgres** to render the list.
    *   Backend proxies requests to the actual MCP servers using the `uri` stored in Postgres.
