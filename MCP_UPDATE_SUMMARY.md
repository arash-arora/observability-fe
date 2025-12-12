# MCP & Dashboard Trends Update

## 1. New MCP Integration Page (`/mcp`)
A new dedicated page for **Model Context Protocol (MCP)** and external tool integrations has been created.
- **MCP Servers**: Manage active MCP servers like Filesystem, PostgreSQL, and GitHub.
- **External Tools**: Slack, ServiceNow, and Jira integrations have been moved here from the main Integrations page.
- **Terminal View**: A debug console to monitor MCP events and tool calls.

## 2. Dashboard Trends
The main dashboard has been upgraded with dynamic visualizations for deeper insights.

### PromptOps Tab
- **Latency vs Token Usage**: A dual-axis Area/Line chart showing the correlation between response time and token consumption over the last 14 days.
- **Performance Trends**: A Line chart tracking the volume of High vs Low performing prompts.

### Evaluations Tab
- **Workflow Routing Accuracy**: An Area chart visualizing the accuracy of agent routing decisions over time.
- **Explainability Metrics**: A Radar chart displaying scores for Faithfulness, Context Relevance, Answer Relevance, Toxicity, and Bias.
- **Agent Tool Usage**: A Bar chart showing the frequency of tool usage (e.g., Vector Search, SQL DB) by agents.

## 3. Data Updates
- **`src/lib/mock-data-v2.ts`**: Expanded with `PROMPT_TRENDS` and `EVALUATION_METRICS` to power the new charts.
- **Refactoring**: Cleaned up `src/app/integrations/page.tsx` to focus solely on Cloud Platforms (AWS, Azure, GCP).
