/**
 * API client functions for PromptOps
 */
const API_BASE_URL = "http://localhost:8000/api";

export interface Prompt {
  id: string;
  name: string;
  version: string;
  systemMessage: string;
  traceId: string;
  observationId: string;
  model: string;
  executions: number;
  avgLatency: number;
  avgCost: number;
  effectivenessScore: number;
  lastEvaluatedAt: string | null;
  discoveredAt: string;
  createdAt: string;
}

export interface PromptsResponse {
  prompts: Prompt[];
  total: number;
  limit: number;
  offset: number;
}

export const promptOpsApi = {
  // Get all prompts
  getPrompts: async (limit: number = 50, offset: number = 0): Promise<PromptsResponse> => {
    const res = await fetch(`${API_BASE_URL}/promptops/prompts?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch prompts");
    return res.json();
  },

  // Trigger evaluation for a prompt
  evaluatePrompt: async (promptId: string): Promise<{
    id: string;
    status: string;
    message: string;
  }> => {
    const res = await fetch(`${API_BASE_URL}/promptops/prompts/${promptId}/evaluate`, {
      method: "POST",
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Failed to evaluate prompt");
    }
    return res.json();
  },
};
