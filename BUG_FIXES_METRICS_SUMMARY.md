# Bug Fixes and Metrics Update

## Bug Fixes
1. **Integrations Page**: Fixed a duplicate key error by removing a redundant GCP integration entry in the state initialization.
2. **PromptOps Page**: Fixed a potential runtime error by adding a safety check `|| 0` for `prompt.executions` when calling `toLocaleString()`.

## Evaluations Page Update
Added a new **Detailed Metrics** section to the Evaluations page (`/evaluations`), featuring:
- **Workflow Metrics**:
  - Agent Routing Accuracy visual bar.
  - Overall Score and Completion Rate cards.
- **Agent Metrics**:
  - Scores for Input Structure and Tool Selection.
  - Visualization of a Common Tool Sequence (WebSearch -> Summarize -> Email).
