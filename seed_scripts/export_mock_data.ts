
import fs from 'fs';
import path from 'path';
import { 
  TRACES_DATA, 
  OBSERVATIONS_DATA, 
  PROMPTS_DATA, 
  EVALUATIONS_DATA 
} from '../src/lib/mock-data-v2';

// Helper to clean currency and time strings
const parseCost = (str: string | undefined) => {
  if (!str || str === '-') return 0;
  return parseFloat(str.replace('$', ''));
};

const parseLatency = (str: string | undefined) => {
  if (!str) return 0;
  return parseFloat(str.replace('s', ''));
};

// Transform Traces
const cleanTraces = TRACES_DATA.map(t => ({
  ...t,
  id: t.id,
  // Ensure timestamp format is compatible
  timestamp: t.timestamp.replace(' ', 'T'), 
  user_id: t.user, // Map user -> user_id
  total_token_count: t.tokens,
  total_cost: parseCost(t.cost),
  latency: parseLatency(t.latency),
  metadata: JSON.stringify({
    environment: t.environment,
    cloudProvider: t.cloudProvider,
    cloudRegion: t.cloudRegion
  }),
  tags: t.tags
}));

// Transform Observations
const cleanObservations = OBSERVATIONS_DATA.map(o => ({
  ...o,
  trace_id: o.traceId,
  start_time: o.timestamp.replace(' ', 'T'), 
  // Derive end_time approx based on latency
  end_time: new Date(new Date(o.timestamp).getTime() + (parseLatency(o.latency) * 1000)).toISOString(),
  cost: parseCost(o.cost),
  // Default values for missing schema fields
  model: o.name.includes('GPT') ? 'gpt-4' : 'unknown',
  input: "Mock input...",
  output: "Mock output..."
}));

// Transform Prompts
const cleanPrompts = PROMPTS_DATA.map(p => ({
  ...p,
  config: JSON.stringify({}), 
  labels: JSON.stringify([p.category, p.pattern])
}));

// Transform Evaluations
const cleanEvaluations = EVALUATIONS_DATA.map(e => ({
  ...e,
  details: JSON.stringify({
    criteria: e.criteria,
    feedback: e.feedback,
    evidence: e.evidence,
    traceList: e.traceList
  })
}));

const completeData = {
  traces: cleanTraces,
  observations: cleanObservations,
  prompts: cleanPrompts,
  evaluations: cleanEvaluations
};

const outputPath = path.join(__dirname, 'seed_data.json');
fs.writeFileSync(outputPath, JSON.stringify(completeData, null, 2));

console.log(`Successfully exported data to ${outputPath}`);
console.log(`Counts: Traces=${cleanTraces.length}, Obs=${cleanObservations.length}, Prompts=${cleanPrompts.length}, Evals=${cleanEvaluations.length}`);
