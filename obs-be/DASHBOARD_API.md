# Dashboard API Endpoints

## Overview
Comprehensive API endpoints for the Analytics Dashboard with real-time data from ClickHouse.

## Base URL
`http://localhost:8000/api/dashboard`

## Endpoints

### 1. **GET /metrics**
Main dashboard metrics including totals, averages, and time-series data.

**Response:**
```json
{
  "totalTraces": 78,
  "totalObservations": 238,
  "avgLatency": 3.45,
  "totalCost": 0.1567,
  "successRate": 85.9,
  "totalTokens": 15600,
  "tracesOverTime": [{"timestamp": "2025-12-15 12:00:00", "count": 15}],
  "latencyOverTime": [{"timestamp": "2025-12-15 12:00:00", "latency": 3.2}],
  "statusDistribution": {"success": 67, "warning": 8, "error": 3}
}
```

### 2. **GET /usage-trends**
Usage trends over the last 7 days (traces, tokens, cost).

**Response:**
```json
[
  {
    "date": "2025-12-15",
    "traces": 25,
    "tokens": 5000,
    "cost": 0.05
  }
]
```

### 3. **GET /model-performance**
Performance metrics grouped by model.

**Response:**
```json
[
  {
    "model": "gpt-4-turbo",
    "count": 30,
    "avgLatency": 4.2,
    "totalTokens": 8500
  }
]
```

### 4. **GET /cost-by-model**
Cost breakdown by model.

**Response:**
```json
[
  {
    "model": "gpt-4-turbo",
    "cost": 0.08,
    "traces": 25
  }
]
```

### 5. **GET /latency-distribution**
Latency distribution in buckets.

**Response:**
```json
[
  {"bucket": "0-1s", "count": 10},
  {"bucket": "1-2s", "count": 25},
  {"bucket": "2-3s", "count": 20}
]
```

### 6. **GET /slowest-traces**
Top slowest traces.

**Query Parameters:**
- `limit` (optional, default: 10)

**Response:**
```json
[
  {
    "id": "tr-abc123",
    "name": "Creative Writing Evaluation",
    "latency": 6.1,
    "timestamp": "2025-12-15 12:30:00"
  }
]
```

### 7. **GET /cloud-distribution**
Distribution of traces by cloud provider (AWS, GCP, Azure).

**Response:**
```json
[
  {"provider": "aws", "count": 15},
  {"provider": "gcp", "count": 8},
  {"provider": "azure", "count": 5}
]
```

### 8. **GET /token-usage**
Token usage over time (last 7 days).

**Response:**
```json
[
  {"date": "2025-12-15", "tokens": 5000}
]
```

### 9. **GET /agent-metrics**
Agent/workflow specific metrics.

**Response:**
```json
{
  "totalWorkflows": 20,
  "totalSteps": 95,
  "toolCalls": 48,
  "avgStepsPerWorkflow": 4.75
}
```

### 10. **GET /tool-usage**
Tool usage statistics for agent workflows.

**Response:**
```json
[
  {
    "tool": "GoogleSearch",
    "count": 15,
    "avgLatency": 1.2
  }
]
```

### 11. **GET /workflow-activity**
Workflow activity over time (last 7 days).

**Response:**
```json
[
  {
    "date": "2025-12-15",
    "workflows": 5,
    "successful": 4,
    "failed": 1
  }
]
```

## Dashboard Tab Mapping

### LLMOps Tab
- `/metrics` - Overview cards
- `/usage-trends` - Usage Trends Chart
- `/model-performance` - Model Latency Chart
- `/cost-by-model` - Cost by Model Chart
- `/latency-distribution` - Latency Distribution Chart
- `/slowest-traces` - Slowest Traces List
- `/cloud-distribution` - Traces by Cloud Chart
- `/token-usage` - Token Usage Chart

### AgentOps Tab
- `/agent-metrics` - Agent Overview Cards
- `/workflow-activity` - Workflow Activity Chart
- `/tool-usage` - Tool Usage Chart & Performance List

### PromptOps Tab
- (Uses existing Postgres data from seed scripts)

### Evaluations Tab
- (Uses existing Postgres data from seed scripts)

## Usage Example

```typescript
// Fetch usage trends
const trends = await fetch('http://localhost:8000/api/dashboard/usage-trends');
const data = await trends.json();

// Fetch model performance
const models = await fetch('http://localhost:8000/api/dashboard/model-performance');
const modelData = await models.json();
```

## Notes

- All endpoints return real-time data from ClickHouse
- Time-series data defaults to last 7 days
- Metrics are calculated on-the-fly
- Cloud provider data comes from trace metadata
- Agent metrics filter for traces with >2 observations
