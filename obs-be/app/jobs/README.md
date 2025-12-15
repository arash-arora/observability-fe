# PromptOps Cron Job Setup

## Overview
This cron job automatically extracts system messages from ClickHouse observations and stores them as prompts in PostgreSQL for analysis and evaluation.

## Setup

### 1. Make the script executable
```bash
chmod +x obs-be/app/jobs/extract_prompts.py
```

### 2. Add to crontab (runs every 2 hours)
```bash
crontab -e
```

Add this line:
```
0 */2 * * * cd /Users/aarora/Dev/antigravity/observability-tool/obs-be && /usr/bin/python3 -m app.jobs.extract_prompts >> /tmp/prompt_extraction.log 2>&1
```

### 3. Manual Execution
You can also run it manually:
```bash
cd obs-be
python3 -m app.jobs.extract_prompts
```

## What It Does

1. **Extracts System Messages**: Queries ClickHouse observations from the last 2 hours
2. **Parses Input Data**: Handles various formats (JSON, OpenAI messages, plain text)
3. **Generates Unique IDs**: Creates prompt IDs based on content hash
4. **Stores in PostgreSQL**: Saves to the `prompts` table with metadata
5. **Tracks Executions**: Updates execution count for existing prompts

## Supported Input Formats

The script can extract system messages from:

- **OpenAI Format**:
  ```json
  {
    "messages": [
      {"role": "system", "content": "You are a helpful assistant"}
    ]
  }
  ```

- **Direct System Field**:
  ```json
  {
    "system": "You are a helpful assistant"
  }
  ```

- **Plain Text**: Detects common patterns like "You are...", "Act as...", etc.

## Database Schema

Prompts are stored with:
- `id`: Unique identifier (hash-based)
- `name`: Auto-generated or from observation
- `system_message`: The extracted prompt text
- `trace_id`: Link to source trace
- `observation_id`: Link to source observation
- `model`: Model used
- `executions`: Usage count
- `discovered_at`: When first discovered

## Monitoring

Check the log file:
```bash
tail -f /tmp/prompt_extraction.log
```

## Troubleshooting

If prompts aren't appearing:
1. Check if observations have system messages in their input
2. Verify ClickHouse connection
3. Check PostgreSQL prompts table
4. Review log file for errors
