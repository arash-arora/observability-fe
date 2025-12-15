# Observability API Backend

Production-grade FastAPI backend for the Observability Tool.

## Project Structure

```
obs-be/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py              # API router aggregation
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── traces.py       # Trace endpoints
│   │           ├── observations.py # Observation endpoints
│   │           └── dashboard.py    # Dashboard metrics
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Configuration settings
│   │   └── database.py            # Database connections
│   └── models/
│       ├── __init__.py
│       └── schemas.py             # Pydantic models
├── main.py                        # Application entry point
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## Architecture

### Separation of Concerns

- **`app/core/`**: Core functionality (config, database)
- **`app/models/`**: Pydantic schemas for validation
- **`app/api/v1/`**: API version 1 endpoints
- **`main.py`**: Application factory and entry point

### Key Features

- **Type Safety**: Pydantic models for request/response validation
- **Configuration Management**: Environment-based settings with pydantic-settings
- **Modular Routing**: Separate routers for different resources
- **CORS Support**: Configured for frontend integration
- **Health Checks**: Built-in health endpoint

## Setup

1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment** (optional):
   Create a `.env` file with:
   ```
   CLICKHOUSE_HOST=localhost
   CLICKHOUSE_PORT=8123
   CLICKHOUSE_USER=default
   CLICKHOUSE_PASSWORD=password
   ```

4. **Run the server**:
   ```bash
   # Development mode with auto-reload
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   
   # Or using Python
   python main.py
   ```

## API Documentation

Once running, access:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## Endpoints

### Health
- `GET /health` - Health check

### Traces
- `GET /api/traces` - List traces (with pagination & search)
- `GET /api/traces/{trace_id}` - Get trace details
- `GET /api/traces/{trace_id}/observations` - Get trace observations

### Observations
- `GET /api/observations` - List observations (with pagination & search)

### Dashboard
- `GET /api/dashboard/metrics` - Get aggregated metrics

## Development

### Adding New Endpoints

1. Create a new router in `app/api/v1/endpoints/`
2. Define Pydantic models in `app/models/schemas.py`
3. Register the router in `app/api/v1/api.py`

### Code Style

- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions focused and testable

## Production Deployment

For production, consider:
- Using Gunicorn with Uvicorn workers
- Setting `DEBUG=False` in config
- Using environment variables for secrets
- Implementing rate limiting
- Adding authentication/authorization
- Setting up logging and monitoring
