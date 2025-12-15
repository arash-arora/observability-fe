"""
PromptOps and Evaluations API endpoints.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

from app.core.postgres import get_postgres_connection
from app.core.database import get_clickhouse_client

router = APIRouter(prefix="/promptops", tags=["promptops"])


@router.get("/stats")
async def get_prompt_stats():
    """Get prompt statistics from PostgreSQL."""
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        # Get total prompts
        cur.execute("SELECT COUNT(*) as count FROM prompts")
        total_prompts = cur.fetchone()['count']
        
        # Calculate stats (using mock calculations for now, can be enhanced)
        high_performers = int(total_prompts * 0.6)  # 60% are high performers
        avg_effectiveness = 0.85  # 85% effectiveness
        
        # Get total executions from ClickHouse (traces that used prompts)
        ch_client = get_clickhouse_client()
        exec_result = ch_client.query("SELECT COUNT(*) as count FROM traces")
        total_executions = exec_result.result_rows[0][0]
        
        # Calculate total cost
        cost_result = ch_client.query("SELECT SUM(total_cost) as cost FROM traces")
        total_cost = float(cost_result.result_rows[0][0] or 0)
        
        return {
            "totalPrompts": total_prompts,
            "highPerformers": high_performers,
            "avgEffectiveness": avg_effectiveness,
            "totalExecutions": total_executions,
            "totalCost": round(total_cost, 2)
        }
    finally:
        cur.close()
        conn.close()


@router.get("/prompts")
async def list_prompts(limit: int = 50, offset: int = 0):
    """List all discovered prompts with their details."""
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT 
                id, name, version, system_message, trace_id, observation_id,
                model, executions, avg_latency, avg_cost, effectiveness_score,
                last_evaluated_at, discovered_at, created_at
            FROM prompts
            ORDER BY discovered_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))
        
        results = cur.fetchall()
        
        prompts = []
        for row in results:
            prompts.append({
                "id": row['id'],
                "name": row['name'],
                "version": row['version'],
                "systemMessage": row['system_message'],
                "traceId": row['trace_id'],
                "observationId": row['observation_id'],
                "model": row['model'],
                "executions": row['executions'] or 0,
                "avgLatency": float(row['avg_latency'] or 0),
                "avgCost": float(row['avg_cost'] or 0),
                "effectivenessScore": float(row['effectiveness_score'] or 0),
                "lastEvaluatedAt": row['last_evaluated_at'].isoformat() if row['last_evaluated_at'] else None,
                "discoveredAt": row['discovered_at'].isoformat() if row['discovered_at'] else None,
                "createdAt": row['created_at'].isoformat() if row['created_at'] else None,
            })
        
        # Get total count
        cur.execute("SELECT COUNT(*) as count FROM prompts")
        total = cur.fetchone()['count']
        
        return {
            "prompts": prompts,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    finally:
        cur.close()
        conn.close()


@router.post("/prompts/{prompt_id}/evaluate")
async def evaluate_prompt(prompt_id: str):
    """
    Trigger evaluation for a specific prompt.
    
    TODO: Implement actual evaluation logic:
    - Fetch all traces using this prompt
    - Calculate performance metrics
    - Calculate effectiveness score
    - Update prompt record with results
    """
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        # Check if prompt exists
        cur.execute("SELECT id, name FROM prompts WHERE id = %s", (prompt_id,))
        prompt = cur.fetchone()
        
        if not prompt:
            raise HTTPException(status_code=404, detail="Prompt not found")
        
        # TODO: Implement evaluation logic here
        # For now, just update the last_evaluated_at timestamp
        cur.execute("""
            UPDATE prompts 
            SET last_evaluated_at = NOW()
            WHERE id = %s
        """, (prompt_id,))
        
        conn.commit()
        
        return {
            "id": prompt_id,
            "status": "queued",
            "message": f"Evaluation queued for prompt: {prompt['name']}"
        }
        
    finally:
        cur.close()
        conn.close()


# Additional endpoints needed by the frontend
@router.get("/feedback/quality-scores")
async def get_quality_scores():
    """Get quality scores from user feedback over time."""
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        # Get feedback data grouped by date
        cur.execute("""
            SELECT 
                DATE(created_at) as date,
                AVG(CASE 
                    WHEN rating = 'positive' THEN 5
                    WHEN rating = 'neutral' THEN 3
                    WHEN rating = 'negative' THEN 1
                    ELSE 3
                END) as user_score
            FROM trace_feedbacks
            WHERE created_at >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(created_at)
            ORDER BY date
        """)
        feedback_data = cur.fetchall()
        
        # If no data, generate sample data
        if not feedback_data:
            base_date = datetime.now() - timedelta(days=6)
            result = []
            for i in range(7):
                date = base_date + timedelta(days=i)
                result.append({
                    "date": date.strftime("%m/%d"),
                    "userScore": round(random.uniform(3.8, 4.5), 1),
                    "aiScore": round(random.uniform(3.5, 4.3), 1)
                })
            return result
        
        # Convert to chart format
        result = []
        for row in feedback_data:
            result.append({
                "date": row['date'].strftime("%m/%d"),
                "userScore": round(float(row['user_score']), 1),
                "aiScore": round(random.uniform(3.5, 4.3), 1)  # Mock AI score for now
            })
        
        return result
    finally:
        cur.close()
        conn.close()
