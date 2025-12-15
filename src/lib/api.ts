
const API_BASE_URL = "http://localhost:8000/api";

export interface Trace {
  id: string;
  timestamp: string;
  name: string;
  user_id: string;
  metadata: Record<string, string>;
  tags: string[];
  input: string;
  output: string;
  total_token_count: number;
  input_cost: number;
  output_cost: number;
  total_cost: number;
  latency: number;
  status: string;
  release: string;
}

export interface Observation {
  id: string;
  trace_id: string;
  parent_observation_id: string;
  type: string;
  name: string;
  start_time: string;
  end_time: string;
  model: string;
  model_parameters: Record<string, string>;
  input: string;
  output: string;
  tokens_prompt: number;
  tokens_completion: number;
  level: string;
}

export const api = {
  getTraces: async (limit: number = 100, offset: number = 0, search: string = ""): Promise<Trace[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const res = await fetch(`${API_BASE_URL}/traces?${params}`);
    if (!res.ok) throw new Error("Failed to fetch traces");
    return res.json();
  },

  getTraceDetail: async (traceId: string): Promise<Trace> => {
    const res = await fetch(`${API_BASE_URL}/traces/${traceId}`);
    if (!res.ok) throw new Error("Failed to fetch trace details");
    return res.json();
  },

  getTraceObservations: async (traceId: string): Promise<Observation[]> => {
    const res = await fetch(`${API_BASE_URL}/traces/${traceId}/observations`);
    if (!res.ok) throw new Error("Failed to fetch trace observations");
    return res.json();
  },

  getObservations: async (limit: number = 100, offset: number = 0, search: string = ""): Promise<Observation[]> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (search) {
      params.append("search", search);
    }
    const res = await fetch(`${API_BASE_URL}/observations?${params}`);
    if (!res.ok) throw new Error("Failed to fetch observations");
    return res.json();
  },

  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/metrics`);
    if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
    return res.json();
  },

  getUsageTrends: async (): Promise<UsageTrend[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/usage-trends`);
    if (!res.ok) throw new Error("Failed to fetch usage trends");
    return res.json();
  },

  getModelPerformance: async (): Promise<ModelPerformance[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/model-performance`);
    if (!res.ok) throw new Error("Failed to fetch model performance");
    return res.json();
  },

  getCostByModel: async (): Promise<CostByModel[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/cost-by-model`);
    if (!res.ok) throw new Error("Failed to fetch cost by model");
    return res.json();
  },

  getLatencyDistribution: async (): Promise<LatencyBucket[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/latency-distribution`);
    if (!res.ok) throw new Error("Failed to fetch latency distribution");
    return res.json();
  },

  getSlowestTraces: async (limit: number = 10): Promise<SlowestTrace[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/slowest-traces?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch slowest traces");
    return res.json();
  },

  getCloudDistribution: async (): Promise<CloudDistribution[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/cloud-distribution`);
    if (!res.ok) throw new Error("Failed to fetch cloud distribution");
    return res.json();
  },

  getTokenUsage: async (): Promise<TokenUsage[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/token-usage`);
    if (!res.ok) throw new Error("Failed to fetch token usage");
    return res.json();
  },

  getAgentMetrics: async (): Promise<AgentMetrics> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/agent-metrics`);
    if (!res.ok) throw new Error("Failed to fetch agent metrics");
    return res.json();
  },

  getToolUsage: async (): Promise<ToolUsage[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/tool-usage`);
    if (!res.ok) throw new Error("Failed to fetch tool usage");
    return res.json();
  },

  getWorkflowActivity: async (): Promise<WorkflowActivity[]> => {
    const res = await fetch(`${API_BASE_URL}/dashboard/workflow-activity`);
    if (!res.ok) throw new Error("Failed to fetch workflow activity");
    return res.json();
  },

  // PromptOps APIs
  getPromptStats: async (): Promise<PromptStats> => {
    const res = await fetch(`${API_BASE_URL}/promptops/stats`);
    if (!res.ok) throw new Error("Failed to fetch prompt stats");
    return res.json();
  },

  getTopPrompts: async (): Promise<TopPrompt[]> => {
    const res = await fetch(`${API_BASE_URL}/promptops/top-prompts`);
    if (!res.ok) throw new Error("Failed to fetch top prompts");
    return res.json();
  },

  getPromptTrends: async (): Promise<PromptTrend[]> => {
    const res = await fetch(`${API_BASE_URL}/promptops/trends`);
    if (!res.ok) throw new Error("Failed to fetch prompt trends");
    return res.json();
  },

  // Evaluations APIs
  getEvaluationStats: async (): Promise<EvaluationStats> => {
    const res = await fetch(`${API_BASE_URL}/promptops/evaluations/stats`);
    if (!res.ok) throw new Error("Failed to fetch evaluation stats");
    return res.json();
  },

  getEvaluationsByType: async (): Promise<EvaluationByType[]> => {
    const res = await fetch(`${API_BASE_URL}/promptops/evaluations/by-type`);
    if (!res.ok) throw new Error("Failed to fetch evaluations by type");
    return res.json();
  },

  getEvaluationMetrics: async (): Promise<EvaluationMetric[]> => {
    const res = await fetch(`${API_BASE_URL}/promptops/evaluations/metrics`);
    if (!res.ok) throw new Error("Failed to fetch evaluation metrics");
    return res.json();
  },

  // Quality/Feedback APIs
  getQualityScores: async (): Promise<QualityScore[]> => {
    const res = await fetch(`${API_BASE_URL}/promptops/feedback/quality-scores`);
    if (!res.ok) throw new Error("Failed to fetch quality scores");
    return res.json();
  },

  // Evaluations APIs
  createEvaluation: async (data: {
    name: string;
    evaluation_types: string[];
    trace_ids: string[];
  }): Promise<{
    id: string;
    name: string;
    status: string;
    message: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/evaluations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to create evaluation");
    }
    return res.json();
  },

  getEvaluations: async (limit: number = 50, offset: number = 0): Promise<{
    evaluations: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      score: number | null;
      created_at: string;
    }>;
    total: number;
    limit: number;
    offset: number;
  }> => {
    const res = await fetch(`${API_BASE_URL}/evaluations?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch evaluations");
    return res.json();
  },
};

export interface DashboardMetrics {
  totalTraces: number;
  totalObservations: number;
  avgLatency: number;
  totalCost: number;
  successRate: number;
  totalTokens: number;
  tracesOverTime: Array<{ timestamp: string; count: number }>;
  latencyOverTime: Array<{ timestamp: string; latency: number }>;
  statusDistribution: Record<string, number>;
  // Evaluation metrics
  totalEvaluations?: number;
  avgEvaluationScore?: number;
  passedEvaluations?: number;
  failedEvaluations?: number;
}

export interface UsageTrend {
  date: string;
  traces: number;
  tokens: number;
  cost: number;
}

export interface ModelPerformance {
  model: string;
  count: number;
  avgLatency: number;
  totalTokens: number;
}

export interface CostByModel {
  model: string;
  cost: number;
  traces: number;
}

export interface LatencyBucket {
  bucket: string;
  count: number;
}

export interface SlowestTrace {
  id: string;
  name: string;
  latency: number;
  timestamp: string;
}

export interface CloudDistribution {
  provider: string;
  count: number;
}

export interface TokenUsage {
  date: string;
  tokens: number;
}

export interface AgentMetrics {
  totalWorkflows: number;
  totalSteps: number;
  toolCalls: number;
  avgStepsPerWorkflow: number;
}

export interface ToolUsage {
  tool: string;
  count: number;
  avgLatency: number;
}

export interface WorkflowActivity {
  date: string;
  workflows: number;
  successful: number;
  failed: number;
}

export interface PromptStats {
  totalPrompts: number;
  highPerformers: number;
  avgEffectiveness: number;
  totalExecutions: number;
  totalCost: number;
}

export interface TopPrompt {
  id: number;
  name: string;
  effectiveness: number;
  executions: number;
  avgLatency: number;
  cost: number;
}

export interface PromptTrend {
  date: string;
  avgTokens: number;
  avgLatency: number;
  highPerforming: number;
  lowPerforming: number;
}

export interface EvaluationStats {
  totalEvaluations: number;
  avgScore: number;
  passed: number;
  failed: number;
}

export interface EvaluationByType {
  type: string;
  count: number;
  avgScore: number;
}

export interface EvaluationMetric {
  metric: string;
  score: number;
}

export interface QualityScore {
  date: string;
  userScore: number;
  aiScore: number;
}
