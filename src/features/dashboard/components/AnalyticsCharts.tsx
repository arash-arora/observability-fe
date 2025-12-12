"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  generateUsageData,
  generateCostData,
  generateLatencyData,
  generateQualityData,
  generateTokenData,
  generateModelLatencyData,
  generateModelCostComparisonData,
  generateAgentWorkflowData,
  generateToolUsageData,
} from "@/lib/mock-data";
import { generateTraces, TOTAL_TRACES } from "@/lib/mock-data";
import { useState, useEffect } from "react";

const useChartData = <T,>(generator: () => T) => {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    setData(generator());
  }, [generator]);
  return data;
};

export function UsageTrendsChart() {
  const data = useChartData(generateUsageData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trace Activity Over Time</CardTitle>
        <CardDescription>Daily trace counts by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="traces"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="generations"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="spans"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CostByModelChart() {
  const data = useChartData(generateCostData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost by Model</CardTitle>
        <CardDescription>Total spend per model (last 30 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="cost"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LatencyDistributionChart() {
  const data = useChartData(generateLatencyData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latency Distribution</CardTitle>
        <CardDescription>Response time breakdown (last 7 days)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="range"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function QualityScoresChart() {
  const data = useChartData(generateQualityData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Scores</CardTitle>
        <CardDescription>User feedback vs AI evaluation scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 5]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="userScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="User Feedback"
            />
            <Line
              type="monotone"
              dataKey="aiScore"
              stroke="#f59e0b"
              strokeWidth={2}
              name="AI Evaluation"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TokenUsageChart() {
  const data = useChartData(generateTokenData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Usage</CardTitle>
        <CardDescription>Input vs output tokens over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value) => value.toLocaleString()}
            />
            <Legend />
            <Bar
              dataKey="input"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Input Tokens"
            />
            <Bar
              dataKey="output"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Output Tokens"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function TracesByCloudChart() {
  // Compute counts by provider from the small demo traces set
  const traces = generateTraces(TOTAL_TRACES);
  const counts: Record<string, number> = {};
  traces.forEach((t: any) => {
    const p = t.cloudProvider || "unknown";
    counts[p] = (counts[p] || 0) + 1;
  });

  const data = Object.entries(counts).map(([provider, count]) => ({
    provider,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traces by Cloud Provider</CardTitle>
        <CardDescription>
          Frequency of traces originating from each cloud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="provider"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ModelLatencyChart() {
  const data = useChartData(generateModelLatencyData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Latency Comparison</CardTitle>
        <CardDescription>P50, P95, P99 latency by model</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}s`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value) => `${value}s`}
            />
            <Legend />
            <Bar
              dataKey="p50"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="P50"
            />
            <Bar
              dataKey="p95"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="P95"
            />
            <Bar
              dataKey="p99"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              name="P99"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ModelCostComparisonChart() {
  const data = useChartData(generateModelCostComparisonData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Cost Comparison</CardTitle>
        <CardDescription>
          Cost per request vs cost per 1k tokens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="model"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
              formatter={(value) => `$${value}`}
            />
            <Legend />
            <Bar
              dataKey="costPerRequest"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Cost/Request"
            />
            <Bar
              dataKey="costPer1kTokens"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Cost/1k Tokens"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AgentWorkflowChart() {
  const data = useChartData(generateAgentWorkflowData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Workflow Activity</CardTitle>
        <CardDescription>
          Workflows, steps, and tool calls over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="workflows"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="steps"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="tools"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ToolUsageChart() {
  const data = useChartData(generateToolUsageData);
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Usage & Performance</CardTitle>
        <CardDescription>
          Most used tools and their average latency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="tool"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              name="Usage Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
