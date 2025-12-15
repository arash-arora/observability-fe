# Docker Deployment Guide

This guide explains how to run the Observability Tool using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### Build and Run

```bash
# Build and start the application in detached mode
docker-compose up --build -d
```

The application will be available at: **http://localhost:3000**

### View Logs

```bash
# View all logs
docker-compose logs

# View logs for the frontend service
docker-compose logs observability-frontend

# Follow logs in real-time
docker-compose logs -f observability-frontend
```

### Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Restart the Application

```bash
# Restart without rebuilding
docker-compose restart

# Rebuild and restart
docker-compose up --build -d
```

## Container Management

### Check Container Status

```bash
docker-compose ps
```

### Access Container Shell

```bash
docker exec -it observability-tool sh
```

### View Resource Usage

```bash
docker stats observability-tool
```

## Development vs Production

### Development Mode (Local)
```bash
npm run dev
```
- Hot reload enabled
- Source maps available
- Runs on http://localhost:3000

### Production Mode (Docker)
```bash
docker-compose up -d
```
- Optimized build
- Minimal image size
- Production-ready server
- Runs on http://localhost:3000

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can either:

1. Stop the conflicting process:
```bash
lsof -ti:3000 | xargs kill -9
```

2. Or change the port in `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Access via http://localhost:8080
```

### Container Won't Start

Check the logs:
```bash
docker-compose logs observability-frontend
```

### Rebuild from Scratch

```bash
# Remove all containers, networks, and images
docker-compose down --rmi all

# Rebuild
docker-compose up --build -d
```

### Clear Docker Cache

```bash
# Remove all unused Docker resources
docker system prune -a
```

## Architecture

The Docker setup uses a multi-stage build:

1. **deps**: Installs dependencies
2. **builder**: Builds the Next.js application
3. **runner**: Runs the production server (minimal image)

This approach ensures:
- Smaller final image size
- Faster builds with layer caching
- Better security (non-root user)
- Production-optimized performance

## Health Checks

The container includes a health check that runs every 30 seconds to ensure the application is responsive.

Check health status:
```bash
docker inspect --format='{{.State.Health.Status}}' observability-tool
```

## Environment Variables

To add environment variables, create a `.env` file in the project root:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then update `docker-compose.yml`:
```yaml
environment:
  - NODE_ENV=production
env_file:
  - .env
```

## Network

The application runs on a dedicated Docker network called `observability-network`, which allows it to communicate with other services (like databases) if needed.

## Additional Services

I noticed you have `obs_postgres` and `obs_clickhouse` containers running. To integrate them with this setup, you can add them to the same `docker-compose.yml` file or ensure they're on the same network.

---

**Need help?** Check the logs or reach out for support!
