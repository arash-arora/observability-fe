"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Zap,
  DollarSign,
  Activity,
  Eye,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PROMPTS_DATA, getPromptStats } from "@/lib/mock-data-v2";

export default function PromptOpsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const prompts = PROMPTS_DATA;
  const stats = getPromptStats();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-emerald-600" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getPatternBadge = (pattern: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      "high-performer": { variant: "default", label: "High Performer" },
      "needs-optimization": { variant: "destructive", label: "Needs Optimization" },
      experimental: { variant: "secondary", label: "Experimental" },
      standard: { variant: "outline", label: "Standard" },
    };
    const { variant, label} = config[pattern];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PromptOps
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Monitor and optimize your prompt performance and effectiveness
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Prompt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Performers
            </CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPerformers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">90%+ effectiveness</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Effectiveness
            </CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.avgEffectiveness * 100).toFixed(1)}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+3.5%</span>
              </div>
              <p className="text-xs text-muted-foreground">from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Executions
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalExecutions / 1000).toFixed(1)}K
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12.3%</span>
              </div>
              <p className="text-xs text-muted-foreground">this week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+15.2%</span>
              </div>
              <p className="text-xs text-muted-foreground">this month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts, agents, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Prompts Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>All Prompts ({filteredPrompts.length})</CardTitle>
          <CardDescription>Manage and monitor your prompt library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border">
                  <TableHead className="font-semibold">Prompt Name</TableHead>
                  <TableHead className="font-semibold">Agent</TableHead>
                  <TableHead className="font-semibold">Trace Link</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Pattern</TableHead>
                  <TableHead className="font-semibold">Effectiveness</TableHead>
                  <TableHead className="font-semibold">Latency</TableHead>
                  <TableHead className="font-semibold">Tokens</TableHead>
                  <TableHead className="font-semibold">Cost</TableHead>
                  <TableHead className="font-semibold">Executions</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrompts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No prompts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrompts.map((prompt) => (
                    <TableRow
                      key={prompt.id}
                      className="hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/promptops/${prompt.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {prompt.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{prompt.agentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/traces/${prompt.traceId}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span className="font-mono">{prompt.traceId}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{prompt.category}</Badge>
                      </TableCell>
                      <TableCell>{getPatternBadge(prompt.pattern)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                prompt.effectiveness >= 0.9
                                  ? "bg-emerald-500"
                                  : prompt.effectiveness >= 0.8
                                  ? "bg-blue-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${prompt.effectiveness * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {(prompt.effectiveness * 100).toFixed(0)}%
                          </span>
                          {getTrendIcon(prompt.trend)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{prompt.avgLatency}</TableCell>
                      <TableCell className="font-mono text-sm">{prompt.avgTokens}</TableCell>
                      <TableCell className="font-mono text-sm">{prompt.avgCost}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {(prompt.executions || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/promptops/${prompt.id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Insights Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <CardTitle>Pattern Insights</CardTitle>
            </div>
            <CardDescription>What makes prompts successful</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  pattern: "High Performers",
                  count: stats.highPerformers,
                  insight: "Use structured formats with clear instructions",
                  icon: CheckCircle2,
                  color: "text-emerald-600",
                },
                {
                  pattern: "Needs Optimization",
                  count: prompts.filter((p) => p.pattern === "needs-optimization").length,
                  insight: "Add few-shot examples to improve accuracy",
                  icon: AlertCircle,
                  color: "text-amber-600",
                },
                {
                  pattern: "Experimental",
                  count: prompts.filter((p) => p.pattern === "experimental").length,
                  insight: "Increase sample size before production",
                  icon: Sparkles,
                  color: "text-purple-600",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <item.icon className={`h-5 w-5 ${item.color} mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.pattern}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.count} prompts
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <CardTitle>Improvement Recommendations</CardTitle>
            </div>
            <CardDescription>Actions to boost effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  action: "Add Context Examples",
                  prompts: "Email Draft Generator",
                  impact: "+12% effectiveness",
                  priority: "High",
                },
                {
                  action: "Reduce Token Usage",
                  prompts: "Code Generation Assistant",
                  impact: "-20% cost",
                  priority: "Medium",
                },
                {
                  action: "Update Instructions",
                  prompts: "Sentiment Analysis",
                  impact: "+5% accuracy",
                  priority: "High",
                },
              ].map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{rec.action}</p>
                      <Badge
                        variant={rec.priority === "High" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{rec.prompts}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">{rec.impact}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
