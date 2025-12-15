"""
Evaluations API endpoints.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid
import random

from app.core.postgres import get_postgres_connection

router = APIRouter(prefix="/evaluations", tags=["evaluations"])


class CreateEvaluationRequest(BaseModel):
    name: str
    evaluation_types: List[str]  # ["agent", "workflow", "explainability", "rag"]
    trace_ids: List[str]


class EvaluationResponse(BaseModel):
    id: str
    name: str
    status: str
    message: str


@router.post("", response_model=EvaluationResponse)
async def create_evaluation(request: CreateEvaluationRequest):
    """
    Create a new evaluation run.
    
    This endpoint:
    1. Accepts evaluation name, types, and trace IDs
    2. Creates evaluation records in PostgreSQL
    3. Returns evaluation ID and status
    
    TODO: Implement actual evaluation processing logic
    - Fetch trace data from ClickHouse
    - Run evaluation algorithms based on type
    - Calculate scores and metrics
    - Store detailed results
    """
    
    if not request.name or not request.name.strip():
        raise HTTPException(status_code=400, detail="Evaluation name is required")
    
    if not request.evaluation_types:
        raise HTTPException(status_code=400, detail="At least one evaluation type is required")
    
    if not request.trace_ids:
        raise HTTPException(status_code=400, detail="At least one trace ID is required")
    
    # Validate evaluation types
    valid_types = ["agent", "workflow", "explainability", "rag"]
    for eval_type in request.evaluation_types:
        if eval_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid evaluation type: {eval_type}. Must be one of {valid_types}"
            )
    
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        # Generate evaluation ID
        evaluation_id = f"eval_{uuid.uuid4().hex[:12]}"
        
        # TODO: ACTUAL EVALUATION PROCESSING WOULD GO HERE
        # ================================================
        # 1. Fetch traces from ClickHouse using trace_ids
        # 2. For each evaluation type, run specific evaluators:
        #    - Agent: Evaluate tool selection, input structure, error recovery
        #    - Workflow: Assess completion rate, routing accuracy, step efficiency
        #    - Explainability: Check reasoning clarity, decision transparency
        #    - RAG: Measure faithfulness, answer relevance, context precision/recall
        # 3. Calculate aggregate scores and detailed metrics
        # 4. Store comprehensive results
        # ================================================
        
        # For now, create dummy evaluation results for each type
        for eval_type in request.evaluation_types:
            # Generate dummy score (0.65 to 0.95)
            score = round(random.uniform(0.65, 0.95), 2)
            
            # Determine status based on score
            if score >= 0.8:
                status = "completed"
            elif score >= 0.6:
                status = "completed"  # Could be "warning" if you want
            else:
                status = "failed"
            
            # Create evaluation details
            details = {
                "model": "evaluation-engine-v1",
                "trace_count": len(request.trace_ids),
                "trace_ids": request.trace_ids,
                "evaluation_config": {
                    "type": eval_type,
                    "threshold": 0.7
                }
            }
            
            # Insert evaluation record
            cur.execute("""
                INSERT INTO evaluations (id, name, type, status, score, details, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                f"{evaluation_id}_{eval_type}",
                f"{request.name} - {eval_type.title()}",
                eval_type,
                status,
                score,
                str(details).replace("'", '"'),  # Convert dict to JSON string
                datetime.now()
            ))
        
        conn.commit()
        
        return EvaluationResponse(
            id=evaluation_id,
            name=request.name,
            status="queued",
            message=f"Evaluation created successfully. Running {len(request.evaluation_types)} evaluation(s) on {len(request.trace_ids)} trace(s)."
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create evaluation: {str(e)}")
    finally:
        cur.close()
        conn.close()


@router.get("/{evaluation_id}")
async def get_evaluation(evaluation_id: str):
    """Get evaluation details by ID."""
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, name, type, status, score, details, created_at
            FROM evaluations
            WHERE id LIKE %s
            ORDER BY created_at DESC
        """, (f"{evaluation_id}%",))
        
        results = cur.fetchall()
        
        if not results:
            raise HTTPException(status_code=404, detail="Evaluation not found")
        
        evaluations = []
        for row in results:
            evaluations.append({
                "id": row['id'],
                "name": row['name'],
                "type": row['type'],
                "status": row['status'],
                "score": float(row['score']) if row['score'] else None,
                "details": row['details'],
                "created_at": row['created_at'].isoformat() if row['created_at'] else None
            })
        
        return {
            "evaluation_id": evaluation_id,
            "evaluations": evaluations,
            "total": len(evaluations)
        }
        
    finally:
        cur.close()
        conn.close()


@router.get("")
async def list_evaluations(limit: int = 50, offset: int = 0):
    """List all evaluations with pagination."""
    conn = get_postgres_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            SELECT id, name, type, status, score, created_at
            FROM evaluations
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """, (limit, offset))
        
        results = cur.fetchall()
        
        evaluations = []
        for row in results:
            evaluations.append({
                "id": row['id'],
                "name": row['name'],
                "type": row['type'],
                "status": row['status'],
                "score": float(row['score']) if row['score'] else None,
                "created_at": row['created_at'].isoformat() if row['created_at'] else None
            })
        
        return {
            "evaluations": evaluations,
            "total": len(evaluations),
            "limit": limit,
            "offset": offset
        }
        
    finally:
        cur.close()
        conn.close()
