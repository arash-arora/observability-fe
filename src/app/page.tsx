"use client";

import { MetricCard } from "@/features/dashboard/components/MetricCard";
import {
  Activity,
  Clock,
  DollarSign,
  Zap,
  AlertCircle,
  GitBranch,
  Workflow,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UsageTrendsChart,
  CostByModelChart,
  LatencyDistributionChart,
  QualityScoresChart,
  TokenUsageChart,
  TracesByCloudChart,
  ModelLatencyChart,
  ModelCostComparisonChart,
  AgentWorkflowChart,
  ToolUsageChart,
} from "@/features/dashboard/components/AnalyticsCharts";
import { useState, useEffect } from "react";
import {
  generateOverviewMetrics,
  generateSlowestTraces,
  generateRecentAlerts,
  generateActiveAgents,
  generateWorkflowFailures,
  generateToolPerformance,
} from "@/lib/mock-data";
import {
  getPromptStats,
  getEvaluationStats,
  getPromptsByEffectiveness,
  getEvaluationsByType,
  PROMPT_TRENDS,
  EVALUATION_METRICS,
} from "@/lib/mock-data-v2";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function Home() {
  const [metrics, setMetrics] = useState<any>(null);
  const [slowestTraces, setSlowestTraces] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeAgents, setActiveAgents] = useState<any[]>([]);
  const [failures, setFailures] = useState<any[]>([]);
  const [toolPerf, setToolPerf] = useState<any[]>([]);
  const [promptStats, setPromptStats] = useState<any>(null);
  const [evalStats, setEvalStats] = useState<any>(null);
  const [topPrompts, setTopPrompts] = useState<any[]>([]);
  const [evalTypes, setEvalTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setMetrics(generateOverviewMetrics());
      setSlowestTraces(generateSlowestTraces());
      setAlerts(generateRecentAlerts());
      setActiveAgents(generateActiveAgents());
      setFailures(generateWorkflowFailures());
      setToolPerf(generateToolPerformance());
      setPromptStats(getPromptStats());
      setEvalStats(getEvaluationStats());
      setTopPrompts(getPromptsByEffectiveness());
      setEvalTypes(getEvaluationsByType());
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-9 w-64 bg-muted rounded-lg skeleton" />
            <div className="h-4 w-96 bg-muted rounded mt-2 skeleton" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Monitor your LLM application performance and costs in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Live</span>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="llmops" className="space-y-6">
        <TabsList>
          <TabsTrigger value="llmops">LLMOps</TabsTrigger>
          <TabsTrigger value="agentops">AgentOps</TabsTrigger>
          <TabsTrigger value="promptops">PromptOps</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
        </TabsList>

        {/* LLMOps Tab */}
        <TabsContent value="llmops" className="space-y-8">
          {/* Overview Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Overview</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Traces"
                value={metrics.totalTraces}
                description="from last 30 days"
                icon={Activity}
                trend="up"
                trendValue="+23.5%"
              />
              <MetricCard
                title="Total Cost"
                value={metrics.totalCost}
                description="from last 30 days"
                icon={DollarSign}
                trend="up"
                trendValue="+12.3%"
              />
              <MetricCard
                title="Avg Latency"
                value={metrics.avgLatency}
                description="P95: 2.4s"
                icon={Clock}
                trend="down"
                trendValue="-8.2%"
              />
              <MetricCard
                title="Success Rate"
                value={metrics.successRate}
                description="from last 30 days"
                icon={Zap}
                trend="up"
                trendValue="+1.2%"
              />
            </div>
          </div>

          {/* Usage Trends */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Usage Trends</h3>
            </div>
            <UsageTrendsChart />
            <div className="mt-4">
              <TracesByCloudChart />
            </div>
          </div>

          {/* Model Comparisons */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Model Comparisons</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ModelLatencyChart />
              <ModelCostComparisonChart />
            </div>
          </div>

          {/* Cost Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Cost Analysis</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CostByModelChart />
              <TokenUsageChart />
            </div>
          </div>

          {/* Performance Monitoring */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Performance</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LatencyDistributionChart />
              <Card>
                <CardHeader>
                  <CardTitle>Top Slowest Traces</CardTitle>
                  <CardDescription>
                    Traces with highest latency in last 24h
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {slowestTraces.map((trace, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{trace.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {trace.model}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono font-medium">
                            {trace.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quality Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Quality & Feedback</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <QualityScoresChart />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Issues detected in last 24h</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.trace}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {alert.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* AgentOps Tab */}
        <TabsContent value="agentops" className="space-y-8">
          {/* Agent Overview Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Agent Overview</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Active Workflows"
                value={metrics.activeWorkflows}
                description="from last 30 days"
                icon={Workflow}
                trend="up"
                trendValue="+18.2%"
              />
              <MetricCard
                title="Total Steps"
                value={metrics.totalSteps}
                description="avg 4.8 steps/workflow"
                icon={GitBranch}
                trend="up"
                trendValue="+15.7%"
              />
              <MetricCard
                title="Tool Calls"
                value={metrics.toolCalls}
                description="from last 30 days"
                icon={Activity}
                trend="up"
                trendValue="+22.4%"
              />
              <MetricCard
                title="Success Rate"
                value={metrics.workflowSuccessRate}
                description="workflow completion"
                icon={Zap}
                trend="up"
                trendValue="+2.1%"
              />
            </div>
          </div>

          {/* Workflow Activity */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Workflow Activity</h3>
            </div>
            <AgentWorkflowChart />
          </div>

          {/* Tool Usage */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Tool Usage</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ToolUsageChart />
              <Card>
                <CardHeader>
                  <CardTitle>Tool Performance</CardTitle>
                  <CardDescription>Average latency by tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {toolPerf.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.tool}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono font-medium">
                            {item.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Agent Performance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Agent Performance</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Most Active Agents</CardTitle>
                  <CardDescription>
                    By workflow count (last 7 days)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeAgents.map((agent, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.avgSteps} avg steps
                          </p>
                        </div>
                        <span className="text-sm font-mono font-medium">
                          {agent.workflows}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Failures</CardTitle>
                  <CardDescription>Recent failed workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {failures.map((failure, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {failure.workflow}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {failure.reason}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">
                          {failure.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PromptOps Tab */}
        <TabsContent value="promptops" className="space-y-6">
          {/* PromptOps Overview */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Prompt Performance</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{promptStats?.totalPrompts || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-600 font-medium">{promptStats?.highPerformers || 0}</span> high performers
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Effectiveness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {promptStats ? (promptStats.avgEffectiveness * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-600 font-medium">Target 90%</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Executions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {promptStats ? (promptStats.totalExecutions / 1000).toFixed(1) : 0}K
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-600 font-medium">All time</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${promptStats ? promptStats.totalCost.toFixed(2) : "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-muted-foreground">Est. monthly</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Performance Trends</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 hover-lift">
                <CardHeader>
                  <CardTitle>Latency vs Token Usage</CardTitle>
                  <CardDescription>Correlation over last 14 days</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PROMPT_TRENDS}>
                        <defs>
                          <linearGradient
                            id="colorTokens"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#82ca9d"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}ms`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="avgTokens"
                          name="Avg Tokens"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorTokens)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgLatency"
                          name="Latency (ms)"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3 hover-lift">
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>High vs Low performing prompts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROMPT_TRENDS.slice(-7)}>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="highPerforming"
                          name="High Performing"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="lowPerforming"
                          name="Low Performing"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Prompts & Optimization */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Top Performing Prompts</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Highest Effectiveness</CardTitle>
                  <CardDescription>Best performing prompts by score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topPrompts.map((prompt: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{prompt.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {prompt.executions.toLocaleString()} uses
                          </p>
                        </div>
                        <span className="text-sm font-mono font-medium text-emerald-600">
                          {(prompt.effectiveness * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Opportunities</CardTitle>
                  <CardDescription>Prompts that need attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Sentiment Analysis",
                        issue: "Low effectiveness",
                        impact: "+15% potential",
                      },
                      {
                        name: "Code Generation",
                        issue: "High token usage",
                        impact: "-20% cost",
                      },
                      {
                        name: "Support Response",
                        issue: "Moderate latency",
                        impact: "-30% latency",
                      },
                    ].map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{opt.name}</p>
                          <p className="text-xs text-muted-foreground">{opt.issue}</p>
                        </div>
                        <span className="text-sm font-medium text-emerald-600">
                          {opt.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Evaluations Tab */}
        <TabsContent value="evaluations" className="space-y-6">
          {/* Evaluations Overview */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Evaluation Metrics</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Evaluations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evalStats?.totalEvaluations || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-600 font-medium">+3</span> this week
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {evalStats ? evalStats.avgScore.toFixed(2) : "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-600 font-medium">+0.05</span> improvement
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Passed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evalStats?.passed || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {evalStats && evalStats.totalEvaluations > 0
                      ? ((evalStats.passed / evalStats.totalEvaluations) * 100).toFixed(0)
                      : 0}
                    % success rate
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Failed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{evalStats?.failed || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Evaluation Insights</h3>
            </div>
            
            {/* Workflow Trend */}
            <div className="grid gap-4 mb-4">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Workflow Routing Accuracy</CardTitle>
                  <CardDescription>Accuracy of agent routing decisions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={EVALUATION_METRICS.workflow.routingAccuracy}>
                        <defs>
                          <linearGradient
                            id="colorRouting"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 1]}
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorRouting)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Explainability Radar */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Explainability Metrics</CardTitle>
                  <CardDescription>Faithfulness, Relevance, and Bias scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        outerRadius="80%"
                        data={EVALUATION_METRICS.explainability}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" fontSize={12} />
                        <PolarRadiusAxis angle={30} domain={[0, 1]} />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Tool Usage */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Agent Tool Usage</CardTitle>
                  <CardDescription>Frequency of tool calls by agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={EVALUATION_METRICS.agent.toolUsage}
                        margin={{ left: 20 }}
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          width={100}
                        />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          radius={[0, 4, 4, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Evaluations & Failed Analysis */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Evaluation Status</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Runs</CardTitle>
                  <CardDescription>Latest evaluation executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Response Quality", status: "passed", score: 0.92 },
                      { name: "Safety & Compliance", status: "warning", score: 0.78 },
                      { name: "Latency Performance", status: "failed", score: 0.65 },
                    ].map((eval_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-2 flex-1">
                          {eval_.status === "passed" && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                          {eval_.status === "warning" && (
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                          )}
                          {eval_.status === "failed" && (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <p className="text-sm font-medium">{eval_.name}</p>
                        </div>
                        <span className="text-sm font-mono font-medium">
                          {eval_.score.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failed Evaluations</CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        name: "Latency Performance",
                        issue: "65% traces exceeded threshold",
                        traces: 130,
                      },
                      {
                        name: "Cost Efficiency",
                        issue: "Avg cost $0.08 (target $0.05)",
                        traces: 95,
                      },
                    ].map((failure, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                      >
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{failure.name}</p>
                          <p className="text-xs text-muted-foreground">{failure.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {failure.traces} affected traces
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
