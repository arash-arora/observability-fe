"""
Cron job to extract system messages from ClickHouse observations
and store them as prompts in PostgreSQL.

Run this every 2 hours via cron:
0 */2 * * * cd /path/to/obs-be && python3 -m app.jobs.extract_prompts
"""
import os
import sys
import json
import hashlib
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_clickhouse_client
from app.core.postgres import get_postgres_connection


def extract_system_message(input_data):
    """
    Extract system message from observation input.
    Handles various input formats (JSON, string, etc.)
    """
    if not input_data:
        return None
    
    try:
        # Try to parse as JSON
        if isinstance(input_data, str):
            data = json.loads(input_data)
        else:
            data = input_data
        
        # Check common patterns for system messages
        if isinstance(data, dict):
            # OpenAI format
            if 'messages' in data:
                for msg in data['messages']:
                    if isinstance(msg, dict) and msg.get('role') == 'system':
                        return msg.get('content')
            
            # Direct system field
            if 'system' in data:
                return data['system']
            
            # System message field
            if 'system_message' in data:
                return data['system_message']
        
        # If it's a list of messages
        if isinstance(data, list):
            for msg in data:
                if isinstance(msg, dict) and msg.get('role') == 'system':
                    return msg.get('content')
        
    except (json.JSONDecodeError, TypeError):
        # If not JSON, check if it starts with common system message patterns
        if isinstance(input_data, str):
            if input_data.strip().startswith(('You are', 'Act as', 'Your role is')):
                return input_data.strip()
    
    return None


def generate_prompt_id(system_message, model):
    """Generate a unique ID for a prompt based on content and model."""
    content = f"{system_message}:{model}"
    return f"prompt_{hashlib.md5(content.encode()).hexdigest()[:12]}"


def extract_and_store_prompts():
    """Main function to extract prompts from observations."""
    print(f"[{datetime.now()}] Starting prompt extraction job...")
    
    # Connect to databases
    ch_client = get_clickhouse_client()
    pg_conn = get_postgres_connection()
    pg_cur = pg_conn.cursor()
    
    try:
        # Query observations from ClickHouse
        # Get observations from the last 2 hours to avoid reprocessing
        query = """
            SELECT 
                id as observation_id,
                trace_id,
                name,
                model,
                input,
                start_time
            FROM observations
            WHERE type = 'generation'
              AND start_time >= now() - INTERVAL 2 HOUR
              AND input != ''
            ORDER BY start_time DESC
            LIMIT 1000
        """
        
        result = ch_client.query(query)
        observations = result.result_rows
        
        print(f"Found {len(observations)} observations to process")
        
        new_prompts = 0
        updated_prompts = 0
        
        for obs in observations:
            observation_id, trace_id, name, model, input_data, start_time = obs
            
            # Extract system message
            system_message = extract_system_message(input_data)
            
            if not system_message:
                continue
            
            # Generate unique ID
            prompt_id = generate_prompt_id(system_message, model)
            
            # Check if prompt already exists
            pg_cur.execute(
                "SELECT id, executions FROM prompts WHERE id = %s",
                (prompt_id,)
            )
            existing = pg_cur.fetchone()
            
            if existing:
                # Update execution count
                pg_cur.execute("""
                    UPDATE prompts 
                    SET executions = executions + 1,
                        trace_id = %s,
                        observation_id = %s
                    WHERE id = %s
                """, (trace_id, observation_id, prompt_id))
                updated_prompts += 1
            else:
                # Insert new prompt
                pg_cur.execute("""
                    INSERT INTO prompts (
                        id, name, system_message, trace_id, observation_id, 
                        model, version, executions, discovered_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    prompt_id,
                    name or f"Discovered Prompt {prompt_id[:8]}",
                    system_message,
                    trace_id,
                    observation_id,
                    model,
                    'v1.0',
                    1,
                    start_time
                ))
                new_prompts += 1
        
        pg_conn.commit()
        
        print(f"✓ Extraction complete!")
        print(f"  - New prompts discovered: {new_prompts}")
        print(f"  - Existing prompts updated: {updated_prompts}")
        
    except Exception as e:
        print(f"✗ Error during extraction: {e}")
        pg_conn.rollback()
        raise
    finally:
        pg_cur.close()
        pg_conn.close()


if __name__ == "__main__":
    extract_and_store_prompts()
