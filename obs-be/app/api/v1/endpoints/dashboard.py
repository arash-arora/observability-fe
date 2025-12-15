"""
Dashboard analytics API endpoints.
"""
from fastapi import APIRouter
from typing import List, Dict, Any

from app.core.database import get_clickhouse_client
from app.core.postgres import get_postgres_connection
from app.models.schemas import DashboardMetrics

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics", response_model=DashboardMetrics)
async def get_dashboard_metrics():
    """Get aggregated dashboard metrics."""
    client = get_clickhouse_client()
    
    # Total traces
    total_traces_result = client.query("SELECT COUNT(*) as count FROM traces")
    total_traces = total_traces_result.result_rows[0][0]
    
    # Total observations
    total_obs_result = client.query("SELECT COUNT(*) as count FROM observations")
    total_observations = total_obs_result.result_rows[0][0]
    
    # Average latency
    avg_latency_result = client.query("SELECT AVG(latency) as avg_lat FROM traces")
    avg_latency = float(avg_latency_result.result_rows[0][0] or 0)
    
    # Total cost
    total_cost_result = client.query("SELECT SUM(total_cost) as total FROM traces")
    total_cost = float(total_cost_result.result_rows[0][0] or 0)
    
    # Success rate
    success_result = client.query("""
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count
        FROM traces
    """)
    total, success_count = success_result.result_rows[0]
    success_rate = (success_count / total * 100) if total > 0 else 0
    
    # Total tokens
    total_tokens_result = client.query("SELECT SUM(total_token_count) as total FROM traces")
    total_tokens = int(total_tokens_result.result_rows[0][0] or 0)
    
    # Traces over time (last 24 hours, grouped by hour)
    traces_over_time_result = client.query("""
        SELECT 
            toStartOfHour(timestamp) as hour,
            COUNT(*) as count
        FROM traces
        WHERE timestamp >= now() - INTERVAL 24 HOUR
        GROUP BY hour
        ORDER BY hour
    """)
    traces_over_time = [
        {"timestamp": str(row[0]), "count": row[1]}
        for row in traces_over_time_result.result_rows
    ]
    
    # Latency over time
    latency_over_time_result = client.query("""
        SELECT 
            toStartOfHour(timestamp) as hour,
            AVG(latency) as avg_latency
        FROM traces
        WHERE timestamp >= now() - INTERVAL 24 HOUR
        GROUP BY hour
        ORDER BY hour
    """)
    latency_over_time = [
        {"timestamp": str(row[0]), "latency": float(row[1])}
        for row in latency_over_time_result.result_rows
    ]
    
    # Status distribution
    status_dist_result = client.query("""
        SELECT status, COUNT(*) as count
        FROM traces
        GROUP BY status
    """)
    status_distribution = {row[0]: row[1] for row in status_dist_result.result_rows}
    
    # Get evaluation metrics from PostgreSQL
    pg_conn = get_postgres_connection()
    pg_cur = pg_conn.cursor()
    
    try:
        # Total evaluations
        pg_cur.execute("SELECT COUNT(*) as count FROM evaluations")
        result = pg_cur.fetchone()
        total_evaluations = result['count'] if result else 0
        
        # Average evaluation score
        pg_cur.execute("SELECT AVG(score) as avg_score FROM evaluations WHERE score IS NOT NULL")
        result = pg_cur.fetchone()
        avg_eval_score = float(result['avg_score'] or 0) if result else 0
        
        # Passed evaluations (score >= 0.8)
        pg_cur.execute("SELECT COUNT(*) as count FROM evaluations WHERE score >= 0.8")
        result = pg_cur.fetchone()
        passed_evaluations = result['count'] if result else 0
        
        # Failed evaluations (score < 0.6)
        pg_cur.execute("SELECT COUNT(*) as count FROM evaluations WHERE score < 0.6")
        result = pg_cur.fetchone()
        failed_evaluations = result['count'] if result else 0
        
    finally:
        pg_cur.close()
        pg_conn.close()
    
    return {
        "totalTraces": total_traces,
        "totalObservations": total_observations,
        "avgLatency": round(avg_latency, 2),
        "totalCost": round(total_cost, 4),
        "successRate": round(success_rate, 1),
        "totalTokens": total_tokens,
        "tracesOverTime": traces_over_time,
        "latencyOverTime": latency_over_time,
        "statusDistribution": status_distribution,
        # Evaluation metrics
        "totalEvaluations": total_evaluations,
        "avgEvaluationScore": round(avg_eval_score, 2),
        "passedEvaluations": passed_evaluations,
        "failedEvaluations": failed_evaluations,
    }


@router.get("/usage-trends")
async def get_usage_trends():
    """Get usage trends over time (last 7 days)."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            toDate(timestamp) as date,
            COUNT(*) as traces,
            SUM(total_token_count) as tokens,
            SUM(total_cost) as cost
        FROM traces
        WHERE timestamp >= now() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
    """)
    
    return [
        {
            "date": str(row[0]),
            "traces": row[1],
            "tokens": row[2],
            "cost": float(row[3])
        }
        for row in result.result_rows
    ]


@router.get("/model-performance")
async def get_model_performance():
    """Get performance metrics by model."""
    client = get_clickhouse_client()
    
    # Extract model from observations
    result = client.query("""
        SELECT 
            model,
            COUNT(*) as count,
            AVG(dateDiff('second', start_time, end_time)) as avg_latency,
            SUM(tokens_prompt + tokens_completion) as total_tokens
        FROM observations
        WHERE model != '' AND model != 'system' AND model != 'sys' AND model != 'tool-server'
        GROUP BY model
        ORDER BY count DESC
        LIMIT 10
    """)
    
    return [
        {
            "model": row[0],
            "count": row[1],
            "avgLatency": float(row[2]) if row[2] else 0,
            "totalTokens": row[3]
        }
        for row in result.result_rows
    ]


@router.get("/cost-by-model")
async def get_cost_by_model():
    """Get cost breakdown by model."""
    client = get_clickhouse_client()
    
    # Get model from metadata or observations
    result = client.query("""
        SELECT 
            o.model,
            SUM(t.total_cost) as total_cost,
            COUNT(DISTINCT t.id) as trace_count
        FROM traces t
        JOIN observations o ON t.id = o.trace_id
        WHERE o.model != '' AND o.model != 'system' AND o.model != 'sys'
        GROUP BY o.model
        ORDER BY total_cost DESC
        LIMIT 10
    """)
    
    return [
        {
            "model": row[0],
            "cost": float(row[1]),
            "traces": row[2]
        }
        for row in result.result_rows
    ]


@router.get("/latency-distribution")
async def get_latency_distribution():
    """Get latency distribution buckets."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            CASE 
                WHEN latency < 1 THEN '0-1s'
                WHEN latency < 2 THEN '1-2s'
                WHEN latency < 3 THEN '2-3s'
                WHEN latency < 5 THEN '3-5s'
                ELSE '5s+'
            END as bucket,
            COUNT(*) as count
        FROM traces
        GROUP BY bucket
        ORDER BY bucket
    """)
    
    return [
        {"bucket": row[0], "count": row[1]}
        for row in result.result_rows
    ]


@router.get("/slowest-traces")
async def get_slowest_traces(limit: int = 10):
    """Get slowest traces."""
    client = get_clickhouse_client()
    
    result = client.query(f"""
        SELECT 
            id,
            name,
            latency,
            timestamp
        FROM traces
        ORDER BY latency DESC
        LIMIT {limit}
    """)
    
    return [
        {
            "id": row[0],
            "name": row[1],
            "latency": float(row[2]),
            "timestamp": str(row[3])
        }
        for row in result.result_rows
    ]


@router.get("/cloud-distribution")
async def get_cloud_distribution():
    """Get trace distribution by cloud provider."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            metadata['cloudProvider'] as provider,
            COUNT(*) as count
        FROM traces
        WHERE metadata['cloudProvider'] != ''
        GROUP BY provider
        ORDER BY count DESC
    """)
    
    return [
        {"provider": row[0], "count": row[1]}
        for row in result.result_rows
    ]


@router.get("/token-usage")
async def get_token_usage():
    """Get token usage over time."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            toDate(timestamp) as date,
            SUM(total_token_count) as tokens
        FROM traces
        WHERE timestamp >= now() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
    """)
    
    return [
        {"date": str(row[0]), "tokens": row[1]}
        for row in result.result_rows
    ]


@router.get("/agent-metrics")
async def get_agent_metrics():
    """Get agent/workflow metrics."""
    client = get_clickhouse_client()
    
    # Count agentic traces (those with multiple observations)
    result = client.query("""
        SELECT 
            COUNT(DISTINCT t.id) as total_workflows,
            COUNT(o.id) as total_steps,
            SUM(CASE WHEN o.type = 'tool' THEN 1 ELSE 0 END) as tool_calls,
            AVG(obs_count.count) as avg_steps_per_workflow
        FROM traces t
        JOIN observations o ON t.id = o.trace_id
        JOIN (
            SELECT trace_id, COUNT(*) as count
            FROM observations
            GROUP BY trace_id
        ) obs_count ON t.id = obs_count.trace_id
        WHERE obs_count.count > 2
    """)
    
    row = result.result_rows[0] if result.result_rows else (0, 0, 0, 0)
    
    return {
        "totalWorkflows": row[0],
        "totalSteps": row[1],
        "toolCalls": row[2],
        "avgStepsPerWorkflow": float(row[3]) if row[3] else 0
    }


@router.get("/tool-usage")
async def get_tool_usage():
    """Get tool usage statistics."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            name,
            COUNT(*) as count,
            AVG(dateDiff('millisecond', start_time, end_time)) as avg_latency_ms
        FROM observations
        WHERE type = 'tool'
        GROUP BY name
        ORDER BY count DESC
        LIMIT 10
    """)
    
    return [
        {
            "tool": row[0],
            "count": row[1],
            "avgLatency": float(row[2]) / 1000 if row[2] else 0  # Convert ms to seconds
        }
        for row in result.result_rows
    ]


@router.get("/workflow-activity")
async def get_workflow_activity():
    """Get workflow activity over time."""
    client = get_clickhouse_client()
    
    result = client.query("""
        SELECT 
            toDate(t.timestamp) as date,
            COUNT(DISTINCT t.id) as workflows,
            SUM(CASE WHEN t.status = 'success' THEN 1 ELSE 0 END) as successful,
            SUM(CASE WHEN t.status = 'error' THEN 1 ELSE 0 END) as failed
        FROM traces t
        JOIN (
            SELECT trace_id, COUNT(*) as count
            FROM observations
            GROUP BY trace_id
        ) obs_count ON t.id = obs_count.trace_id
        WHERE obs_count.count > 2
          AND t.timestamp >= now() - INTERVAL 7 DAY
        GROUP BY date
        ORDER BY date
    """)
    
    return [
        {
            "date": str(row[0]),
            "workflows": row[1],
            "successful": row[2],
            "failed": row[3]
        }
        for row in result.result_rows
    ]
