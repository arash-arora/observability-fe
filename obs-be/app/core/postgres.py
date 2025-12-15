"""
PostgreSQL database connection management.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor


def get_postgres_connection():
    """Get PostgreSQL database connection."""
    return psycopg2.connect(
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        database=os.getenv("POSTGRES_DB", "observability"),
        user=os.getenv("POSTGRES_USER", "postgres"),
        password=os.getenv("POSTGRES_PASSWORD", "password"),
        cursor_factory=RealDictCursor
    )
