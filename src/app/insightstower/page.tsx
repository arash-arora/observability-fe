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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Activity,
  Stethoscope,
  Wrench,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Send,
} from "lucide-react";

export default function WatchTowerPage() {
  const [activeTab, setActiveTab] = useState("monitor");
  const [monitoringStatus, setMonitoringStatus] = useState<"active" | "paused">("active");

  // Mock data for monitoring
  const liveTraces = [
    {
      id: "tr-001",
      timestamp: "10:58:45",
      name: "Customer Query Processing",
      status: "success",
      latency: "1.2s",
      tokens: 450,
      cost: "$0.0023",
    },
    {
      id: "tr-002",
      timestamp: "10:58:42",
      name: "Document Analysis",
      status: "warning",
      latency: "3.5s",
      tokens: 1200,
      cost: "$0.0089",
    },
    {
      id: "tr-003",
      timestamp: "10:58:38",
      name: "Code Generation",
      status: "error",
      latency: "5.2s",
      tokens: 2100,
      cost: "$0.0156",
    },
  ];

  // Mock data for diagnosis
  const issues = [
    {
      id: "issue-001",
      trace: "tr-003",
      severity: "high",
      type: "Performance",
      issue: "High latency detected (5.2s)",
      impact: "User experience degradation",
      detected: "2 min ago",
    },
    {
      id: "issue-002",
      trace: "tr-002",
      severity: "medium",
      type: "Cost",
      issue: "Token usage above threshold",
      impact: "Increased operational costs",
      detected: "5 min ago",
    },
    {
      id: "issue-003",
      trace: "tr-005",
      severity: "low",
      type: "Quality",
      issue: "Low relevance score (0.65)",
      impact: "Potential accuracy issues",
      detected: "10 min ago",
    },
  ];

  // Mock data for resolver
  const resolutions = [
    {
      id: "res-001",
      issue: "High latency in Code Generation",
      status: "resolved",
      action: "Switched to faster model (gpt-3.5-turbo)",
      result: "Latency reduced from 5.2s to 1.8s",
      resolvedAt: "5 min ago",
    },
    {
      id: "res-002",
      issue: "Token usage optimization",
      status: "in-progress",
      action: "Implementing prompt compression",
      result: "Expected 30% reduction",
      resolvedAt: "In progress",
    },
    {
      id: "res-003",
      issue: "Quality improvement for summarization",
      status: "pending",
      action: "Add few-shot examples",
      result: "Pending implementation",
      resolvedAt: "Not started",
    },
  ];

  // Mock data for feedbacks
  const feedbacks = [
    {
      id: "fb-001",
      trace: "tr-001",
      user: "john@example.com",
      rating: "positive",
      comment: "Excellent response quality and speed",
      timestamp: "10 min ago",
    },
    {
      id: "fb-002",
      trace: "tr-003",
      user: "sarah@example.com",
      rating: "negative",
      comment: "Too slow, took more than 5 seconds",
      timestamp: "15 min ago",
    },
    {
      id: "fb-003",
      trace: "tr-007",
      user: "mike@example.com",
      rating: "positive",
      comment: "Accurate and helpful information",
      timestamp: "20 min ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, any> = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    };
    return (
      <Badge variant={variants[severity]} className="capitalize">
        {severity}
      </Badge>
    );
  };

  const getResolutionStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      resolved: "default",
      "in-progress": "secondary",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status.replace("-", " ")}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Insights Tower
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Real-time monitoring, diagnosis, resolution, and feedback management
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={monitoringStatus === "active" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setMonitoringStatus(monitoringStatus === "active" ? "paused" : "active")
            }
            className="gap-2"
          >
            {monitoringStatus === "active" ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume Monitoring
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Traces
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+12</span>
              </div>
              <p className="text-xs text-muted-foreground">last hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Issues Detected
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-red-600">
                <TrendingUp className="h-3 w-3" />
                <span>+3</span>
              </div>
              <p className="text-xs text-muted-foreground">needs attention</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Auto-Resolved
            </CardTitle>
            <Wrench className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+8</span>
              </div>
              <p className="text-xs text-muted-foreground">this hour</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              User Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>+2%</span>
              </div>
              <p className="text-xs text-muted-foreground">satisfaction</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitor" className="gap-2">
            <Activity className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Diagnosis
          </TabsTrigger>
          <TabsTrigger value="resolver" className="gap-2">
            <Wrench className="h-4 w-4" />
            Resolver
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Feedbacks
          </TabsTrigger>
        </TabsList>

        {/* Monitor Tab */}
        <TabsContent value="monitor" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium">
                {monitoringStatus === "active" ? "Live Monitoring Active" : "Monitoring Paused"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search traces..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Live Trace Stream</CardTitle>
              <CardDescription>Real-time trace execution monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-border">
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">Trace ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Latency</TableHead>
                      <TableHead className="font-semibold text-right">Tokens</TableHead>
                      <TableHead className="font-semibold text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveTraces.map((trace) => (
                      <TableRow
                        key={trace.id}
                        className="hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors duration-200"
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {trace.timestamp}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{trace.id}</TableCell>
                        <TableCell className="font-medium">{trace.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(trace.status)}
                            <Badge
                              variant={
                                trace.status === "success"
                                  ? "default"
                                  : trace.status === "warning"
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="capitalize"
                            >
                              {trace.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {trace.latency}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {trace.tokens}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {trace.cost}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Issue Detection & Analysis</CardTitle>
              <CardDescription>
                Automated diagnosis of performance, cost, and quality issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        issue.severity === "high"
                          ? "bg-red-500/10 text-red-600"
                          : issue.severity === "medium"
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{issue.issue}</h4>
                        {getSeverityBadge(issue.severity)}
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Impact:</span> {issue.impact}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {issue.detected}
                        </span>
                        <span className="font-mono">Trace: {issue.trace}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resolver Tab */}
        <TabsContent value="resolver" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Auto-Resolution & Remediation</CardTitle>
              <CardDescription>
                Automated and manual resolution of detected issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resolutions.map((resolution) => (
                  <div
                    key={resolution.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        resolution.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : resolution.status === "in-progress"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-gray-500/10 text-gray-600"
                      }`}
                    >
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{resolution.issue}</h4>
                        {getResolutionStatusBadge(resolution.status)}
                      </div>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Action:</span> {resolution.action}
                      </p>
                      <p className="text-sm text-emerald-600 mb-2">
                        <span className="font-medium">Result:</span> {resolution.result}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resolution.resolvedAt}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={resolution.status === "resolved" ? "outline" : "default"}
                      size="sm"
                    >
                      {resolution.status === "resolved" ? "View Details" : "Apply Fix"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedbacks Tab */}
        <TabsContent value="feedbacks" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>User Feedback & Ratings</CardTitle>
              <CardDescription>
                Collect and analyze user feedback on trace quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        feedback.rating === "positive"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {feedback.rating === "positive" ? (
                        <ThumbsUp className="h-5 w-5" />
                      ) : (
                        <ThumbsDown className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{feedback.user}</h4>
                        <Badge
                          variant={feedback.rating === "positive" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {feedback.rating}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{feedback.comment}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {feedback.timestamp}
                        </span>
                        <span className="font-mono">Trace: {feedback.trace}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Send className="h-3 w-3" />
                      Respond
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>Provide feedback on trace quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Trace ID</label>
                  <Input placeholder="Enter trace ID..." />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      Positive
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <ThumbsDown className="h-4 w-4" />
                      Negative
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Comment</label>
                  <Input placeholder="Your feedback..." />
                </div>
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
