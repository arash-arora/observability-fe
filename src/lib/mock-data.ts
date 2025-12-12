import { faker } from "@faker-js/faker";
import { TRACES_DATA } from "./mock-data-v2";

// Baseline used across dashboard generators so everything scales to the same
// realistic demo size. The app currently only contains 10 traces, so keep
// analytics and agentops numbers small and consistent.
export const TOTAL_TRACES = TRACES_DATA.length;

// --- Traces Data ---

export const generateTraces = (count = TOTAL_TRACES) => {
  // Return the real static data, optionally sliced (though we usually want all of it)
  // We map it to ensure all fields expected by the UI are present, although they mostly match.
  return TRACES_DATA.slice(0, count).map(t => ({
    ...t,
    // Ensure numeric/string consistency if needed, but TRACES_DATA seems compatible.
    // TRACES_DATA has latency as "1.2s", cost as "$0.0022"
    // cloudAccount/Resource were in the old generator, adding defaults if missing:
    cloudAccount: "acct-default", 
    cloudResource: t.name.toLowerCase().replace(/\s+/g, '-'),
  }));
};

export const generateObservationTree = (traceId: string, traceName: string) => {
  const isInsurance = traceName.includes("Insurance");
  const timestamp = new Date();

  const createObservation = (
    name: string,
    type: "SPAN" | "GENERATION" | "EVENT",
    offsetMs: number,
    durationMs: number,
    input: any,
    output: any,
    children: any[] = []
  ) => {
    const start = new Date(timestamp.getTime() + offsetMs);
    const end = new Date(start.getTime() + durationMs);
    return {
      id: `obs_${faker.string.alphanumeric(8)}`,
      name,
      type,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      latency: `${(durationMs / 1000).toFixed(2)}s`,
      cost:
        type === "GENERATION"
          ? `$${faker.number
              .float({ min: 0.0001, max: 0.002, multipleOf: 0.00001 })
              .toFixed(6)}`
          : undefined,
      status: "success" as const,
      input,
      output,
      children,
    };
  };

  if (isInsurance) {
    return [
      createObservation(
        "Insurance Claim Processing",
        "SPAN",
        0,
        1500,
        { policyId: "POL-123", incident: "Collision" },
        { eligible: true, payout: "$2400" },
        [
          createObservation(
            "Retrieve Policy Details",
            "SPAN",
            100,
            300,
            { policyId: "POL-123" },
            { type: "Comprehensive", status: "Active" }
          ),
          createObservation(
            "Analyze Incident Report",
            "GENERATION",
            450,
            800,
            {
              description: "Rear-ended at red light",
              damage: "Bumper and trunk",
            },
            { fault: "Other driver", covered: true },
            []
          ),
          createObservation(
            "Calculate Payout",
            "SPAN",
            1300,
            150,
            { damage_estimate: "$2500", deductible: "$100" },
            { final_payout: "$2400" }
          ),
        ]
      ),
    ];
  } else {
    return [
      createObservation(
        "Medical Diagnosis Session",
        "SPAN",
        0,
        2000,
        { patient: "Male, 45", symptom: "Chest Pain" },
        { diagnosis: "Angina", urgency: "High" },
        [
          createObservation(
            "Analyze Symptoms",
            "GENERATION",
            100,
            600,
            { symptoms: ["Chest pain", "Sweating", "Nausea"] },
            { potential_causes: ["MI", "Angina", "Panic Attack"] }
          ),
          createObservation(
            "Check Medical History",
            "SPAN",
            750,
            200,
            { patientId: "PAT-998" },
            { history: ["Smoker", "Hypertension"] }
          ),
          createObservation(
            "Differential Diagnosis",
            "GENERATION",
            1000,
            900,
            { symptoms: ["Chest pain"], history: ["Smoker"] },
            { diagnosis: "Angina", confidence: 0.85, recommended: "ECG" }
          ),
        ]
      ),
    ];
  }
};

// --- Analytics Data ---

export const generateUsageData = () => {
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Scale counts appropriately for the dashboard.
  // We want the weekly sum to roughly align with the total traces relative 
  // to how much "history" the dashboard implies it shows (e.g. 30 days).
  // If we have 50 total traces, maybe 5-10 per day is reasonable for visual variation.
  return dates.map((date) => ({
    date,
    traces: faker.number.int({
      min: Math.max(1, Math.floor(TOTAL_TRACES / 5)),
      max: Math.max(2, Math.floor(TOTAL_TRACES / 2)),
    }),
    generations: faker.number.int({
      min: Math.max(1, Math.floor(TOTAL_TRACES / 4)),
      max: Math.max(2, Math.floor(TOTAL_TRACES / 1.5)),
    }),
    spans: faker.number.int({ 
      min: Math.max(1, Math.floor(TOTAL_TRACES / 2)), 
      max: TOTAL_TRACES 
    }),
  }));
};

export const generateCostData = () => {
  // Aggregate real cost data from TRACES_DATA
  const modelStats: Record<string, { cost: number; tokens: number }> = {};
  
  TRACES_DATA.forEach(trace => {
    const model = trace.model || "unknown";
    const cost = parseFloat(trace.cost.replace('$', ''));
    const tokens = typeof trace.tokens === 'number' ? trace.tokens : 0;
    
    if (!modelStats[model]) {
      modelStats[model] = { cost: 0, tokens: 0 };
    }
    modelStats[model].cost += cost;
    modelStats[model].tokens += tokens;
  });

  return Object.entries(modelStats).map(([model, stats]) => ({
    model,
    cost: stats.cost,
    tokens: stats.tokens,
  }));
};

export const generateLatencyData = () => {
  const ranges = [
    { label: "0-0.5s", min: 0, max: 0.5, count: 0 },
    { label: "0.5-1s", min: 0.5, max: 1.0, count: 0 },
    { label: "1-2s", min: 1.0, max: 2.0, count: 0 },
    { label: "2-3s", min: 2.0, max: 3.0, count: 0 },
    { label: "3-5s", min: 3.0, max: 5.0, count: 0 },
    { label: "5s+", min: 5.0, max: Infinity, count: 0 },
  ];

  TRACES_DATA.forEach(trace => {
    const latencyVal = parseFloat(trace.latency.replace('s', ''));
    const range = ranges.find(r => latencyVal >= r.min && latencyVal < r.max);
    if (range) {
      range.count++;
    }
  });

  return ranges.map(r => ({ range: r.label, count: r.count }));
};

export const generateQualityData = () => {
  return Array.from({ length: 4 }).map((_, i) => ({
    date: `Week ${i + 1}`,
    userScore: faker.number.float({ min: 3.5, max: 4.8, multipleOf: 0.1 }),
    aiScore: faker.number.float({ min: 3.8, max: 4.9, multipleOf: 0.1 }),
  }));
};

export const generateTokenData = () => {
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  // Scale token usage based on TOTAL_TRACES to ensure graph values 
  // are consistent with the total volume of traces shown.
  // Assuming avg ~1000 tokens per trace.
  const baseVolume = TOTAL_TRACES * 50; 
  
  return dates.map((date) => ({
    date,
    input: faker.number.int({ min: baseVolume, max: baseVolume * 4 }),
    output: faker.number.int({ min: baseVolume / 2, max: baseVolume * 2 }),
  }));
};

export const generateModelLatencyData = () => {
  const latenciesByModel: Record<string, number[]> = {};

  TRACES_DATA.forEach(trace => {
    const model = trace.model || "unknown";
    const latency = parseFloat(trace.latency.replace('s', ''));
    if (!latenciesByModel[model]) {
      latenciesByModel[model] = [];
    }
    latenciesByModel[model].push(latency);
  });

  const calculatePercentile = (arr: number[], p: number) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(p * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  };

  return Object.entries(latenciesByModel).map(([model, latencies]) => ({
    model,
    p50: calculatePercentile(latencies, 0.5).toFixed(2),
    p95: calculatePercentile(latencies, 0.95).toFixed(2),
    p99: calculatePercentile(latencies, 0.99).toFixed(2),
  }));
};

export const generateModelCostComparisonData = () => {
  return [
    { model: "gpt-4", costPerRequest: 0.035, costPer1kTokens: 0.03 },
    { model: "gpt-3.5-turbo", costPerRequest: 0.003, costPer1kTokens: 0.002 },
    { model: "claude-2", costPerRequest: 0.028, costPer1kTokens: 0.024 },
    { model: "claude-instant", costPerRequest: 0.004, costPer1kTokens: 0.003 },
  ];
};

export const generateAgentWorkflowData = () => {
  const dates = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i) * 7);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  return dates.map((date) => ({
    date,
    workflows: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES) }),
    steps: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES * 6) }),
    tools: faker.number.int({ min: 1, max: Math.max(1, TOTAL_TRACES * 3) }),
  }));
};

export const generateToolUsageData = () => {
  // Reduce synthetic tool counts to be reasonable for TOTAL_TRACES demo set
  return [
    {
      tool: "web_search",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.5, max: 2.5, multipleOf: 0.1 }),
    },
    {
      tool: "code_executor",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 2 }),
      avgLatency: faker.number.float({ min: 0.2, max: 2.0, multipleOf: 0.1 }),
    },
    {
      tool: "database_query",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.1, max: 1.2, multipleOf: 0.1 }),
    },
    {
      tool: "api_call",
      count: faker.number.int({ min: 0, max: TOTAL_TRACES * 3 }),
      avgLatency: faker.number.float({ min: 0.2, max: 1.8, multipleOf: 0.1 }),
    },
  ];
};

// --- Dashboard Overview Data ---

export const generateOverviewMetrics = () => {
  // Use TRACES_DATA from v2 to match the Traces page
  const traces = TRACES_DATA;
  const agentRuns =
    typeof generateAgentOpsData === "function"
      ? generateAgentOpsData(traces.length)
      : [];

  const totalTraces = traces.length;
  const totalCost = traces.reduce(
    (sum, t) => sum + parseFloat(String(t.cost).replace(/[^0-9.]/g, "") || "0"),
    0
  );
  const avgLatency =
    (
      traces.reduce(
        (s, t) => s + parseFloat(String(t.latency).replace(/s$/, "")),
        0
      ) / Math.max(1, totalTraces)
    ).toFixed(2) + "s";
  const successRate = `${Math.round(
    (traces.filter((t) => t.status === "success").length /
      Math.max(1, totalTraces)) *
      100
  )}%`;
  const totalSteps = agentRuns.reduce((s, r) => s + (r.steps || 0), 0);
  const toolCalls = agentRuns.reduce(
    (s, r) => s + (r.toolsUsed ? r.toolsUsed.length : 0),
    0
  );
  const workflowSuccessRate = `${Math.round(
    (agentRuns.filter((r) => r.status === "success").length /
      Math.max(1, agentRuns.length)) *
      100
  )}%`;

  return {
    totalTraces: `${totalTraces}`,
    totalCost: `$${totalCost.toFixed(4)}`, // Adjusted precision for larger sums
    avgLatency,
    successRate,
    activeWorkflows: `${agentRuns.length}`,
    totalSteps: `${totalSteps}`,
    toolCalls: `${toolCalls}`,
    workflowSuccessRate,
  };
};

export const generateSlowestTraces = () => {
  // Sort TRACES_DATA by latency (descending) and take top 5
  return [...TRACES_DATA]
    .sort((a, b) => {
      const latA = parseFloat(a.latency.replace('s', ''));
      const latB = parseFloat(b.latency.replace('s', ''));
      return latB - latA;
    })
    .slice(0, 5)
    .map(t => ({
      name: t.name,
      model: t.model || "unknown",
      latency: t.latency,
    }));
};

export const generateRecentAlerts = () => {
  return [
    {
      type: "High Latency",
      trace: "Insurance Claim POL-882190",
      time: "2m ago",
    },
    { type: "Cost Spike", trace: "Medical Diagnosis Batch", time: "15m ago" },
    {
      type: "Token Limit",
      trace: "Insurance Claim POL-445123",
      time: "1h ago",
    },
  ];
};

export const generateActiveAgents = () => {
  // Return active agents with smaller, realistic demo numbers
  const agents = [
    "Insurance Claim Eligibility Agent",
    "Medical Diagnosis Assistant",
    "Customer Support Agent",
    "Financial Analysis Agent",
  ];

  return agents.map((name) => ({
    name,
    workflows: `${faker.number.int({
      min: 0,
      max: Math.max(1, Math.floor(TOTAL_TRACES / 2)),
    })}`,
    avgSteps: `${faker.number
      .float({ min: 1, max: 6, multipleOf: 0.1 })
      .toFixed(1)}`,
  }));
};

export const generateWorkflowFailures = () => {
  return [
    {
      workflow: "Insurance Claim Processing",
      reason: "Policy database timeout",
      time: "5m ago",
    },
    {
      workflow: "Medical Diagnosis",
      reason: "API rate limit exceeded",
      time: "12m ago",
    },
    {
      workflow: "Customer Support",
      reason: "Invalid input format",
      time: "25m ago",
    },
  ];
};

export const generateToolPerformance = () => {
  return [
    { tool: "web_search", latency: "2.1s", status: "healthy" },
    { tool: "code_executor", latency: "1.8s", status: "healthy" },
    { tool: "database_query", latency: "0.9s", status: "healthy" },
    { tool: "api_call", latency: "1.5s", status: "degraded" },
  ];
};

// --- Agent Operations (agentops) Mock Data ---

export const generateAgentOpsData = (count = 8) => {
  const statuses = ["running", "success", "failed", "cancelled"];
  const agents = [
    "Invoice Processing Agent",
    "Order Fulfillment Agent",
    "Fraud Detection Agent",
    "Customer Onboarding Agent",
    "Insurance Claim Agent",
    "Medical Triage Agent",
    "Data Enrichment Agent",
  ];

  return Array.from({ length: count }).map(() => {
    const start = faker.date.recent({ days: 7 });
    const durationMs = faker.number.int({ min: 200, max: 20_000 });
    const end = new Date(start.getTime() + durationMs);

    return {
      id: `ag_${faker.string.alphanumeric(10)}`,
      runId: `run_${faker.string.alphanumeric(8)}`,
      agentName: faker.helpers.arrayElement(agents),
      status: faker.helpers.arrayElement(statuses),
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      duration: `${(durationMs / 1000).toFixed(2)}s`,
      steps: faker.number.int({ min: 1, max: 40 }),
      toolsUsed: faker.helpers.arrayElements(
        [
          "web_search",
          "database_query",
          "api_call",
          "code_executor",
          "file_system",
        ],
        faker.number.int({ min: 1, max: 3 })
      ),
      cost: `$${faker.number
        .float({ min: 0.0005, max: 0.02, multipleOf: 0.0001 })
        .toFixed(6)}`,
      metrics: {
        successRate: faker.number.float({
          min: 0.6,
          max: 1.0,
          multipleOf: 0.01,
        }),
        meanStepDuration: `${faker.number
          .float({ min: 0.05, max: 2.0, multipleOf: 0.01 })
          .toFixed(2)}s`,
      },
      logs: faker.lorem.sentences(faker.number.int({ min: 1, max: 4 })),
      environment: faker.helpers.arrayElement([
        "production",
        "staging",
        "development",
      ]),
      tags: faker.helpers.arrayElements(
        ["critical", "batch", "realtime", "scheduled"],
        faker.number.int({ min: 0, max: 2 })
      ),
    };
  });
};

export const generateAgentOpsOverview = () => {
  const runs = generateAgentOpsData(12);
  const totalRuns = runs.length;
  const avgDurationSec = (
    runs.reduce((s, r) => s + parseFloat(r.duration.replace("s", "")), 0) /
    totalRuns
  ).toFixed(2);
  const failureCount = runs.filter(
    (r) => r.status === "failed" || r.status === "cancelled"
  ).length;
  const failureRate = ((failureCount / totalRuns) * 100).toFixed(1) + "%";

  const topAgentsMap: Record<string, number> = {};
  runs.forEach((r) => {
    topAgentsMap[r.agentName] = (topAgentsMap[r.agentName] || 0) + 1;
  });
  const topAgents = Object.entries(topAgentsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, runs: count }));

  return {
    totalRuns: `${totalRuns}`,
    avgDuration: `${avgDurationSec}s`,
    failureRate,
    topAgents,
  };
};
