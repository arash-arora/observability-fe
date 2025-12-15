"""
Database connection and client management.
"""
import clickhouse_connect
from app.core.config import settings


def get_clickhouse_client():
    """Get ClickHouse database client."""
    return clickhouse_connect.get_client(
        host=settings.CLICKHOUSE_HOST,
        port=settings.CLICKHOUSE_PORT,
        username=settings.CLICKHOUSE_USER,
        password=settings.CLICKHOUSE_PASSWORD
    )
