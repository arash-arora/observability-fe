"""
Observation-related API endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter

from app.core.database import get_clickhouse_client
from app.models.schemas import Observation

router = APIRouter(prefix="/observations", tags=["observations"])


@router.get("", response_model=List[Observation])
async def get_observations(
    limit: int = 100,
    offset: int = 0,
    search: Optional[str] = None
):
    """Get list of observations with optional search and pagination."""
    client = get_clickhouse_client()
    query = "SELECT * FROM observations"
    
    if search:
        query += f" WHERE name ILIKE '%{search}%' OR input ILIKE '%{search}%' OR output ILIKE '%{search}%'"
    
    query += f" ORDER BY start_time DESC LIMIT {limit} OFFSET {offset}"
    
    result = client.query(query)
    columns = result.column_names
    
    observations = []
    for row in result.result_rows:
        obs_dict = dict(zip(columns, row))
        observations.append(obs_dict)
    
    return observations
