"use client";

import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Clock,
  DollarSign,
  Users,
  Copy,
  Edit,
  Play,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Mock prompt detail data
  const promptDetails = {
    id: id,
    name: "Customer Support Response",
    agentName: "Support Agent",
    traceId: "tr_abc123",
    category: "Support",
    status: "active",
    pattern: "high-performer",
    version: "v2.3",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    effectiveness: 0.94,
    avgLatency: "1.2s",
    avgTokens: 450,
    avgCost: "$0.0023",
    executions: 15420,
    lastUsed: "2 min ago",
    trend: "up",
    promptText: `You are a helpful customer support agent. Your goal is to assist customers with their inquiries in a friendly and professional manner.

When responding to customer queries:
1. Greet the customer warmly
2. Acknowledge their concern or question
3. Provide a clear and concise answer
4. Offer additional help if needed
5. End with a friendly closing

Example:
Customer: "I can't log into my account"
Response: "Hello! I'm sorry to hear you're having trouble logging in. Let me help you with that. Have you tried resetting your password using the 'Forgot Password' link on the login page? If that doesn't work, I can send you a password reset link directly. Is there anything else I can help you with today?"

Remember to:
- Be empathetic and understanding
- Use simple, clear language
- Avoid technical jargon unless necessary
- Always maintain a positive tone`,
    metadata: {
      temperature: 0.7,
      maxTokens: 500,
      topP: 0.9,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0,
    },
    performance: {
      successRate: 0.96,
      avgResponseTime: "1.2s",
      errorRate: 0.04,
      userSatisfaction: 0.92,
    },
    recentExecutions: [
      {
        id: "exec-001",
        traceId: "tr_abc123",
        timestamp: "2 min ago",
        latency: "1.1s",
        tokens: 445,
        cost: "$0.0022",
        status: "success",
      },
      {
        id: "exec-002",
        traceId: "tr_abc124",
        timestamp: "5 min ago",
        latency: "1.3s",
        tokens: 460,
        cost: "$0.0024",
        status: "success",
      },
      {
        id: "exec-003",
        traceId: "tr_abc125",
        timestamp: "8 min ago",
        latency: "1.2s",
        tokens: 448,
        cost: "$0.0023",
        status: "success",
      },
    ],
  };

  const getPatternBadge = (pattern: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      "high-performer": { variant: "default", label: "High Performer" },
      "needs-optimization": { variant: "destructive", label: "Needs Optimization" },
      experimental: { variant: "secondary", label: "Experimental" },
      standard: { variant: "outline", label: "Standard" },
    };
    const { variant, label } = config[pattern];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/promptops">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {promptDetails.name}
              </h2>
              {getPatternBadge(promptDetails.pattern)}
              <Badge variant="outline" className="font-mono">
                {promptDetails.version}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{promptDetails.agentName}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>{promptDetails.category}</span>
              </div>
              <Link
                href={`/traces/${promptDetails.traceId}`}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <span className="font-mono">{promptDetails.traceId}</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button size="sm" className="gap-2">
            <Play className="h-4 w-4" />
            Test
          </Button>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Effectiveness
            </CardTitle>
            <Zap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {(promptDetails.effectiveness * 100).toFixed(0)}%
              </div>
              {getTrendIcon(promptDetails.trend)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Success rate: {(promptDetails.performance.successRate * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Latency
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promptDetails.avgLatency}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Error rate: {(promptDetails.performance.errorRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promptDetails.avgCost}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {promptDetails.avgTokens} tokens avg
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Executions
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(promptDetails.executions / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last used: {promptDetails.lastUsed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Prompt Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prompt Template</CardTitle>
              <CardDescription>The actual prompt text used for this agent</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap border">
            {promptDetails.promptText}
          </div>
        </CardContent>
      </Card>

      {/* Configuration & Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Model parameters and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(promptDetails.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-sm font-mono font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Detailed performance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${promptDetails.performance.successRate * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-medium">
                    {(promptDetails.performance.successRate * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="text-sm font-mono font-medium">
                  {promptDetails.performance.avgResponseTime}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Error Rate</span>
                <span className="text-sm font-mono font-medium">
                  {(promptDetails.performance.errorRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">User Satisfaction</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${promptDetails.performance.userSatisfaction * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-medium">
                    {(promptDetails.performance.userSatisfaction * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>Latest runs of this prompt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {promptDetails.recentExecutions.map((exec) => (
              <Link
                key={exec.id}
                href={`/traces/${exec.traceId}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="text-sm font-mono font-medium">{exec.traceId}</p>
                    <p className="text-xs text-muted-foreground">{exec.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono">{exec.latency}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono">{exec.tokens}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono">{exec.cost}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Insights</CardTitle>
          <CardDescription>Recommendations to improve this prompt</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Excellent Performance</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This prompt is performing exceptionally well with 94% effectiveness and high user satisfaction.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Consider A/B Testing</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Test variations with different temperature settings to potentially improve response quality.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
