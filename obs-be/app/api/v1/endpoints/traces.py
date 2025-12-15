"""
Trace-related API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, HTTPException

from app.core.database import get_clickhouse_client
from app.models.schemas import Trace, Observation

router = APIRouter(prefix="/traces", tags=["traces"])


@router.get("", response_model=List[Trace])
async def get_traces(
    limit: int = 100,
    offset: int = 0,
    search: Optional[str] = None
):
    """Get list of traces with optional search and pagination."""
    client = get_clickhouse_client()
    query = "SELECT * FROM traces"
    
    if search:
        query += f" WHERE name ILIKE '%{search}%' OR input ILIKE '%{search}%'"
    
    query += f" ORDER BY timestamp DESC LIMIT {limit} OFFSET {offset}"
    
    result = client.query(query)
    columns = result.column_names
    
    traces = []
    for row in result.result_rows:
        trace_dict = dict(zip(columns, row))
        traces.append(trace_dict)
    
    return traces


@router.get("/{trace_id}", response_model=Trace)
async def get_trace_detail(trace_id: str):
    """Get detailed information about a specific trace."""
    client = get_clickhouse_client()
    result = client.query(f"SELECT * FROM traces WHERE id = '{trace_id}'")
    
    if not result.result_rows:
        raise HTTPException(status_code=404, detail="Trace not found")
    
    columns = result.column_names
    return dict(zip(columns, result.result_rows[0]))


@router.get("/{trace_id}/observations", response_model=List[Observation])
async def get_trace_observations(trace_id: str):
    """Get all observations for a specific trace."""
    client = get_clickhouse_client()
    query = f"SELECT * FROM observations WHERE trace_id = '{trace_id}' ORDER BY start_time ASC"
    result = client.query(query)
    columns = result.column_names
    
    observations = []
    for row in result.result_rows:
        obs_dict = dict(zip(columns, row))
        observations.append(obs_dict)
    
    return observations
