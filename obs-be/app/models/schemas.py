"""
Pydantic models for API request/response validation.
"""
from datetime import datetime
from typing import Dict, List, Any
from pydantic import BaseModel


class Trace(BaseModel):
    """Trace model."""
    id: str
    timestamp: datetime
    name: str
    user_id: str
    metadata: Dict[str, str]
    tags: List[str]
    input: str
    output: str
    total_token_count: int
    input_cost: float
    output_cost: float
    total_cost: float
    latency: float
    status: str
    release: str


class Observation(BaseModel):
    """Observation model."""
    id: str
    trace_id: str
    parent_observation_id: str
    type: str
    name: str
    start_time: datetime
    end_time: datetime
    model: str
    model_parameters: Dict[str, str]
    input: str
    output: str
    tokens_prompt: int
    tokens_completion: int
    level: str


class DashboardMetrics(BaseModel):
    """Dashboard metrics response model."""
    totalTraces: int
    totalObservations: int
    avgLatency: float
    totalCost: float
    successRate: float
    totalTokens: int
    tracesOverTime: List[Dict[str, Any]]
    latencyOverTime: List[Dict[str, Any]]
    statusDistribution: Dict[str, int]
    # Evaluation metrics
    totalEvaluations: int = 0
    avgEvaluationScore: float = 0.0
    passedEvaluations: int = 0
    failedEvaluations: int = 0
