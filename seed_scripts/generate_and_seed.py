
import psycopg2
import clickhouse_connect
import uuid
import json
import random
from datetime import datetime, timedelta
import time
import os

# --- Configuration ---
PG_HOST = os.getenv("POSTGRES_HOST", "localhost")
PG_DB = os.getenv("POSTGRES_DB", "observability")
PG_USER = os.getenv("POSTGRES_USER", "postgres")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
PG_PORT = os.getenv("POSTGRES_PORT", "5432")

CH_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CH_PORT = os.getenv("CLICKHOUSE_PORT", "8123")
CH_USER = os.getenv("CLICKHOUSE_USER", "default")
CH_PASSWORD = os.getenv("CLICKHOUSE_PASSWORD", "password")

# --- STATIC MOCK DATA (From Frontend) ---

MCP_SERVERS = [
    {"id": "mcp-fs", "name": "Filesystem Server", "type": "stdio", "status": "connected", "details": "Access local files safely"},
    {"id": "mcp-pg", "name": "PostgreSQL Adapter", "type": "sse", "status": "connected", "details": "Read/Write to production DB"},
    {"id": "mcp-gh", "name": "GitHub MCP", "type": "stdio", "status": "disconnected", "details": "Repository search & management"},
]

INTEGRATIONS = [
    {"id": "azure-1", "platform": "Azure", "name": "Development Azure", "region": "eastus", "status": "connected", "details": {"subscriptionId": "abc-123", "services": ["OpenAI Service"]}},
    {"id": "aws-1", "platform": "AWS", "name": "Production AWS Account", "region": "us-east-1", "status": "connected", "details": {"accountId": "123456789012", "services": ["Bedrock", "SageMaker"]}},
    {"id": "gcp-1", "platform": "GCP", "name": "Analytics GCP Project", "region": "us-central1", "status": "disconnected", "details": {"projectId": "my-project-123", "services": ["Vertex AI"]}},
    {"id": "servicenow-1", "platform": "ServiceNow", "name": "IT Service Management", "region": "global", "status": "connected", "details": {"category": "enterprise"}},
    {"id": "slack-1", "platform": "Slack", "name": "Team Workspace", "region": "global", "status": "connected", "details": {"category": "communication"}},
]

INSIGHTS_ISSUES = [
    {"id": "issue-001", "title": "High latency in Code Generation", "severity": "high", "status": "active", "root_cause": "Model contention on gpt-4", "detected_at": "2 min ago"},
    {"id": "issue-002", "title": "Token usage above threshold", "severity": "medium", "status": "investigating", "root_cause": "Inefficient prompt structure", "detected_at": "5 min ago"},
    {"id": "issue-003", "title": "Low relevance score (0.65)", "severity": "low", "status": "resolved", "root_cause": "Context window truncation", "detected_at": "10 min ago"},
]

INSIGHTS_RESOLUTIONS = [
    {"id": "res-001", "issue_id": "issue-001", "action": "Switched to faster model", "result": "Latency reduced", "status": "resolved"},
    {"id": "res-002", "issue_id": "issue-002", "action": "Implementing prompt compression", "result": "Expected 30% reduction", "status": "in-progress"},
]

EVALUATIONS = [
    {"id": "eval-001", "name": "Agent Tool Selection Check", "type": "agent", "status": "completed", "score": 0.92, "details": {"model": "gpt-4", "criteria": "tool_selection"}},
    {"id": "eval-002", "name": "RAG Faithfulness Test", "type": "rag", "status": "completed", "score": 0.88, "details": {"model": "gpt-4", "criteria": "faithfulness"}},
    {"id": "eval-003", "name": "Workflow Completion Eval", "type": "workflow", "status": "completed", "score": 0.85, "details": {"model": "claude-3", "criteria": "completion_rate"}},
    {"id": "eval-004", "name": "Explainability Reasoning Check", "type": "explainability", "status": "completed", "score": 0.90, "details": {"model": "gpt-4", "criteria": "reasoning_clarity"}},
    {"id": "eval-005", "name": "Agent Error Recovery Test", "type": "agent", "status": "completed", "score": 0.95, "details": {"model": "gpt-4", "criteria": "error_recovery"}},
    {"id": "eval-006", "name": "RAG Context Precision", "type": "rag", "status": "completed", "score": 0.87, "details": {"model": "gpt-3.5", "criteria": "context_precision"}},
    {"id": "eval-007", "name": "Workflow Routing Accuracy", "type": "workflow", "status": "failed", "score": 0.65, "details": {"model": "gpt-3.5", "criteria": "routing_accuracy"}},
    {"id": "eval-008", "name": "Explainability Decision Transparency", "type": "explainability", "status": "completed", "score": 0.82, "details": {"model": "claude-3", "criteria": "decision_transparency"}},
]

FEEDBACKS = [
    {"trace_id": "tr_cs_001", "user_email": "john@example.com", "rating": "positive", "comment": "Excellent response quality"},
    {"trace_id": "tr_cs_002", "user_email": "sarah@example.com", "rating": "negative", "comment": "Too slow"},
]

def load_json_data():
    try:
        with open('seed_data.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("seed_data.json not found, skipping JSON seed.")
        return {}

def load_prompts_data():
    try:
        with open('prompts.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("prompts.json not found, using empty prompts list.")
        return {"prompts": []}

# --- MAIN SEED FUNCTION ---

def seed_databases():
    print("Starting Hybrid Seeding...")
    json_data = load_json_data()
    prompts_data = load_prompts_data()

    # 1. Connect to Postgres
    try:
        pg_conn = psycopg2.connect(
            host=PG_HOST, database=PG_DB, user=PG_USER, password=PG_PASSWORD, port=PG_PORT
        )
        pg_cur = pg_conn.cursor()
        pg_conn.autocommit = True
        print("Connected to Postgres.")
    except Exception as e:
        print(f"PG Connection Failed: {e}")
        return

    # 2. Connect to ClickHouse
    try:
        ch_client = clickhouse_connect.get_client(
            host=CH_HOST, port=int(CH_PORT), username=CH_USER, password=CH_PASSWORD
        )
        print("Connected to ClickHouse.")
    except Exception as e:
        print(f"CH Connection Failed: {e}")
        return

    # --- POSTGRES SCHEMA & DATA ---
    print("Setting up Postgres Schema...")
    
    # Drop tables to ensure schema updates apply
    pg_cur.execute("""
        DROP TABLE IF EXISTS insights_resolutions;
        DROP TABLE IF EXISTS insights_incidents;
        DROP TABLE IF EXISTS trace_feedbacks;
        DROP TABLE IF EXISTS evaluations;
        DROP TABLE IF EXISTS prompts;
        DROP TABLE IF EXISTS integrations;
        DROP TABLE IF EXISTS mcp_servers;
    """)

    # Create Tables
    pg_cur.execute("""
        CREATE TABLE IF NOT EXISTS organizations (id UUID PRIMARY KEY, name TEXT);
        CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, org_id UUID, email TEXT, role TEXT);
        
        CREATE TABLE IF NOT EXISTS mcp_servers (
            id TEXT PRIMARY KEY, name TEXT, type TEXT, status TEXT, config JSONB, created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS integrations (
            id TEXT PRIMARY KEY, platform TEXT, name TEXT, region TEXT, status TEXT, details JSONB, created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS prompts (
            id TEXT PRIMARY KEY,
            name TEXT,
            version TEXT,
            template TEXT,
            system_message TEXT,
            trace_id TEXT,
            observation_id TEXT,
            model TEXT,
            config JSONB,
            labels JSONB,
            executions INT DEFAULT 0,
            avg_latency FLOAT DEFAULT 0,
            avg_cost FLOAT DEFAULT 0,
            effectiveness_score FLOAT DEFAULT 0,
            last_evaluated_at TIMESTAMP,
            discovered_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS evaluations (
            id TEXT PRIMARY KEY, name TEXT, type TEXT, status TEXT, score FLOAT, details JSONB, created_at TIMESTAMP DEFAULT NOW()
        );
        -- CHANGED: id type to TEXT to support string IDs
        CREATE TABLE IF NOT EXISTS insights_incidents (
            id TEXT PRIMARY KEY, title TEXT, severity TEXT, status TEXT, root_cause TEXT, detected_at TEXT
        );
        CREATE TABLE IF NOT EXISTS insights_resolutions (
            id TEXT PRIMARY KEY, issue_id TEXT, action TEXT, result TEXT, status TEXT
        );
        CREATE TABLE IF NOT EXISTS trace_feedbacks (
            id SERIAL PRIMARY KEY, trace_id TEXT, user_email TEXT, rating TEXT, comment TEXT, created_at TIMESTAMP DEFAULT NOW()
        );
    """)
    
    # Insert MCP Servers
    print("Seeding MCP Servers...")
    for mcp in MCP_SERVERS:
        pg_cur.execute("""
            INSERT INTO mcp_servers (id, name, type, status, config)
            VALUES (%s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING
        """, (mcp['id'], mcp['name'], mcp['type'], mcp['status'], json.dumps({"details": mcp['details']})))

    # Insert Integrations
    print("Seeding Integrations...")
    for integ in INTEGRATIONS:
        pg_cur.execute("""
            INSERT INTO integrations (id, platform, name, region, status, details)
            VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING
        """, (integ['id'], integ['platform'], integ['name'], integ['region'], integ['status'], json.dumps(integ['details'])))

    # Insert Prompts (from JSON)
    print("Seeding Prompts...")
    pg_cur.execute("DELETE FROM prompts") 
    prompts_list = prompts_data.get('prompts', [])
    for idx, p in enumerate(prompts_list):
        pg_cur.execute("""
            INSERT INTO prompts (id, name, version, template, config, labels)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (f"prompt-{idx+1:03d}", p['name'], "v1.0", "Template placeholder", json.dumps(p['config']), json.dumps(p['labels'])))


    # Insert Evaluations (from JSON)
    print("Seeding Evaluations...")
    pg_cur.execute("DELETE FROM evaluations")
    for ev in EVALUATIONS:
        pg_cur.execute("""
            INSERT INTO evaluations (id, name, type, status, score, details)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (ev['id'], ev['name'], ev['type'], ev['status'], ev['score'], json.dumps(ev['details'])))
    
    # Insert Incidents & Resolutions
    print("Seeding Insights Incidents & Resolutions...")
    pg_cur.execute("DELETE FROM insights_incidents")
    pg_cur.execute("DELETE FROM insights_resolutions")
    
    for issue in INSIGHTS_ISSUES:
        pg_cur.execute("""
            INSERT INTO insights_incidents (id, title, severity, status, root_cause, detected_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (issue['id'], issue['title'], issue['severity'], issue['status'], issue['root_cause'], issue['detected_at']))

    for res in INSIGHTS_RESOLUTIONS:
        pg_cur.execute("""
            INSERT INTO insights_resolutions (id, issue_id, action, result, status)
            VALUES (%s, %s, %s, %s, %s)
        """, (res['id'], res['issue_id'], res['action'], res['result'], res['status']))
        
    # Insert Feedbacks
    print("Seeding Feedbacks...")
    pg_cur.execute("DELETE FROM trace_feedbacks")
    for fb in FEEDBACKS:
        pg_cur.execute("""
            INSERT INTO trace_feedbacks (trace_id, user_email, rating, comment)
            VALUES (%s, %s, %s, %s)
        """, (fb['trace_id'], fb['user_email'], fb['rating'], fb['comment']))

    # --- CLICKHOUSE SCHEMA & DATA ---
    print("Setting up ClickHouse Schema...")

    ch_client.command("DROP TABLE IF EXISTS traces")
    ch_client.command("DROP TABLE IF EXISTS observations")

    ch_client.command("""
        CREATE TABLE IF NOT EXISTS traces (
            id String, timestamp DateTime64(6), name String, user_id String, metadata Map(String, String),
            tags Array(String), input String, output String, total_token_count Int32, input_cost Float64,

            output_cost Float64, total_cost Float64, latency Float64, status String, release String
        ) ENGINE = MergeTree() ORDER BY (timestamp, user_id)
    """)

    ch_client.command("""
        CREATE TABLE IF NOT EXISTS observations (
            id String, trace_id String, parent_observation_id String, type String, name String,
            start_time DateTime64(6), end_time DateTime64(6), model String, model_parameters Map(String, String),
            input String, output String, tokens_prompt Int32, tokens_completion Int32, level String
        ) ENGINE = MergeTree() ORDER BY (trace_id, start_time)
    """)
    
    # Insert Traces from JSON
    print("Seeding Traces from JSON...")
    traces_list = json_data.get('traces', [])
    trace_columns = [
        "id", "timestamp", "name", "user_id", "metadata", "tags", "input", "output",
        "total_token_count", "input_cost", "output_cost", "total_cost", "latency", "status", "release"
    ]
    trace_data = []
    
    for t in traces_list:
        # valid metadata must be Map(String, String)
        meta_raw = json.loads(t['metadata'])
        meta_clean = {k: str(v) if not isinstance(v, str) else v for k, v in meta_raw.items()}
        
        trace_data.append([
            t['id'], t['timestamp'], t['name'], t['user_id'], meta_clean, t['tags'], str(t['input']), str(t['output']),
            t['total_token_count'], 0.0, 0.0, t['total_cost'], t['latency'], t['status'], "v1.0.0"
        ])
        
    if trace_data:
        print(f"Inserting {len(trace_data)} Traces into ClickHouse...")
        ch_client.insert('traces', trace_data, column_names=trace_columns)

    # Insert Observations from JSON
    print("Seeding Observations from JSON...")
    obs_list = json_data.get('observations', [])
    obs_columns = [
        "id", "trace_id", "parent_observation_id", "type", "name", "start_time", "end_time",
        "model", "model_parameters", "input", "output", "tokens_prompt", "tokens_completion", "level"
    ]
    obs_data = []
    for o in obs_list:
        obs_data.append([
            o['id'], o['trace_id'], "", o['type'], o['name'], o['start_time'], o['end_time'],
            o.get('model', 'unknown'), {}, o.get('input', ''), o.get('output', ''), 0, 0, "DEFAULT"
        ])

    if obs_data:
        print(f"Inserting {len(obs_data)} Observations into ClickHouse...")
        ch_client.insert('observations', obs_data, column_names=obs_columns)

    print("--- Seeding Complete! ---")
    pg_cur.close()
    pg_conn.close()
    
if __name__ == "__main__":
    seed_databases()
