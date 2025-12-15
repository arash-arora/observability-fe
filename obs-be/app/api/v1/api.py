"""API v1 router aggregation."""
from fastapi import APIRouter

from app.api.v1.endpoints import traces, observations, dashboard, promptops, evaluations

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(traces.router)
api_router.include_router(observations.router)
api_router.include_router(dashboard.router)
api_router.include_router(promptops.router)
api_router.include_router(evaluations.router)
