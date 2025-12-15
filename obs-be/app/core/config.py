"""
Core configuration settings for the Observability API.
"""
import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    APP_NAME: str = "Observability API"
    API_V1_PREFIX: str = "/api"
    DEBUG: bool = True
    
    # CORS Settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # ClickHouse Settings
    CLICKHOUSE_HOST: str = os.getenv("CLICKHOUSE_HOST", "localhost")
    CLICKHOUSE_PORT: int = int(os.getenv("CLICKHOUSE_PORT", "8123"))
    CLICKHOUSE_USER: str = os.getenv("CLICKHOUSE_USER", "default")
    CLICKHOUSE_PASSWORD: str = os.getenv("CLICKHOUSE_PASSWORD", "password")
    
    class Config:
        case_sensitive = True


settings = Settings()
