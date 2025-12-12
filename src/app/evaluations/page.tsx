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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  TrendingUp,
  BarChart3,
  Play,
  Eye,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  FileText,
  X,
  Bot,
  Workflow,
  Lightbulb,
  Database,
} from "lucide-react";
import Link from "next/link";
import { EVALUATIONS_DATA, getEvaluationStats, EVALUATION_METRICS } from "@/lib/mock-data-v2";

interface EvaluationRun {
  id: string;
  name: string;
  type: string;
  status: "passed" | "failed" | "warning";
  score: number;
  traces: number;
  lastRun: string;
  criteria: string;
  feedback?: string;
  evidence?: string;
  traceList: Array<{
    id: string;
    name: string;
    score: number;
    status: string;
  }>;
}

export default function EvaluationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("agent");
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRun | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Use centralized evaluation data
  const allEvaluations: EvaluationRun[] = EVALUATIONS_DATA;
  const stats = getEvaluationStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      passed: "default",
      failed: "destructive",
      warning: "secondary",
    };
    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (evaluation: EvaluationRun) => {
    setSelectedEvaluation(evaluation);
    setShowModal(true);
  };

  const handleRerun = (evaluationId: string) => {
    alert(`Rerunning evaluation: ${evaluationId}`);
  };

  const getEvaluationsByType = (type: string) => {
    return allEvaluations.filter((eval_) => eval_.type === type);
  };

  const filterEvaluations = (evaluations: EvaluationRun[]) => {
    if (!searchQuery) return evaluations;
    return evaluations.filter((evaluation) =>
      evaluation.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getTabStats = (type: string) => {
    const evals = getEvaluationsByType(type);
    const passed = evals.filter((e) => e.status === "passed").length;
    const avgScore = evals.reduce((sum, e) => sum + e.score, 0) / evals.length;
    return { total: evals.length, passed, avgScore };
  };

  const renderEvaluationTable = (evaluations: EvaluationRun[]) => {
    const filtered = filterEvaluations(evaluations);
    
    return (
      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="font-semibold">Evaluation Run</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Score</TableHead>
                <TableHead className="font-semibold">Traces</TableHead>
                <TableHead className="font-semibold">Last Run</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No evaluations found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    className="hover:bg-muted/50 cursor-pointer border-b border-border/50"
                  >
                    <TableCell className="font-medium">{evaluation.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(evaluation.status)}
                        {getStatusBadge(evaluation.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              evaluation.score >= 0.8
                                ? "bg-emerald-500"
                                : evaluation.score >= 0.6
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${evaluation.score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-medium">
                          {evaluation.score.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{evaluation.traces}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {evaluation.lastRun}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleViewDetails(evaluation)}
                        >
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleRerun(evaluation.id)}
                        >
                          <Play className="h-3 w-3" />
                          Rerun
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Evaluations
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Evaluate and score your agents, workflows, and RAG systems
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Evaluation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Runs
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">Across 4 types</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgScore.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">Overall</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.passed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.passed / stats.totalEvaluations) * 100).toFixed(0)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Needs Attention
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.failed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Failed or Warning</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              Workflow Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Agent Routing Accuracy</span>
                <span className="font-mono font-medium">94.2%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[94.2%]" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Overall Score</p>
                  <p className="text-xl font-bold">0.92</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
                  <p className="text-xl font-bold">95%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              Agent Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Input Structure Score</span>
                <span className="font-mono font-medium text-emerald-600">0.98</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tool Selection</span>
                <span className="font-mono font-medium text-blue-600">0.94</span>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Common Tool Sequence</p>
                <div className="flex items-center gap-2 text-xs font-mono bg-muted p-2 rounded">
                  <span>WebSearch</span>
                  <span className="text-muted-foreground">→</span>
                  <span>Summarize</span>
                  <span className="text-muted-foreground">→</span>
                  <span>Email</span>
                </div>
              </div>
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
            placeholder="Search evaluation runs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="agent" className="gap-2">
            <Bot className="h-4 w-4" />
            Agent Evaluation
            <Badge variant="secondary" className="ml-2">
              {getTabStats("agent").total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="workflow" className="gap-2">
            <Workflow className="h-4 w-4" />
            Workflow
            <Badge variant="secondary" className="ml-2">
              {getTabStats("workflow").total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="explainability" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Explainability
            <Badge variant="secondary" className="ml-2">
              {getTabStats("explainability").total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rag" className="gap-2">
            <Database className="h-4 w-4" />
            RAG Evaluation
            <Badge variant="secondary" className="ml-2">
              {getTabStats("rag").total}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("agent").total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{getTabStats("agent").passed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("agent").avgScore.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          {renderEvaluationTable(getEvaluationsByType("agent"))}
        </TabsContent>

        <TabsContent value="workflow" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("workflow").total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{getTabStats("workflow").passed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("workflow").avgScore.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          {renderEvaluationTable(getEvaluationsByType("workflow"))}
        </TabsContent>

        <TabsContent value="explainability" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("explainability").total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{getTabStats("explainability").passed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("explainability").avgScore.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          {renderEvaluationTable(getEvaluationsByType("explainability"))}
        </TabsContent>

        <TabsContent value="rag" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("rag").total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Passed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{getTabStats("rag").passed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTabStats("rag").avgScore.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
          {renderEvaluationTable(getEvaluationsByType("rag"))}
        </TabsContent>
      </Tabs>

      {/* Modal - Same as before */}
      {showModal && selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedEvaluation.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 capitalize">
                  {selectedEvaluation.type} Evaluation
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Evaluation Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold">
                      {(selectedEvaluation.score * 100).toFixed(0)}%
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            selectedEvaluation.score >= 0.8
                              ? "bg-emerald-500"
                              : selectedEvaluation.score >= 0.6
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${selectedEvaluation.score * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(selectedEvaluation.status)}
                        {getStatusBadge(selectedEvaluation.status)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p><span className="font-medium">Criteria:</span> {selectedEvaluation.criteria}</p>
                    <p className="mt-1"><span className="font-medium">Last Run:</span> {selectedEvaluation.lastRun}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Metric Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedEvaluation.type === "rag"
                      ? [
                          { name: "Faithfulness", score: Math.min(1, selectedEvaluation.score + 0.05) },
                          { name: "Answer Relevance", score: selectedEvaluation.score },
                          {
                            name: "Context Precision",
                            score: Math.max(0, selectedEvaluation.score - 0.05),
                          },
                          {
                            name: "Context Recall",
                            score: Math.min(1, selectedEvaluation.score + 0.02),
                          },
                        ]
                      : selectedEvaluation.type === "agent"
                      ? [
                          { name: "Tool Selection", score: Math.min(1, selectedEvaluation.score + 0.03) },
                          { name: "Input Structure", score: selectedEvaluation.score },
                          {
                            name: "Error Recovery",
                            score: Math.max(0, selectedEvaluation.score - 0.1),
                          },
                        ]
                      : [
                          { name: "Accuracy", score: selectedEvaluation.score },
                          {
                            name: "Latency Score",
                            score: Math.max(0, selectedEvaluation.score - 0.05),
                          },
                          { name: "Output Format", score: selectedEvaluation.score },
                        ]
                    ).map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric.name}</span>
                          <span className="font-mono font-medium">
                            {(metric.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${metric.score * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedEvaluation.status === "passed" ? (
                      <ThumbsUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ThumbsDown className="h-5 w-5 text-red-600" />
                    )}
                    Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedEvaluation.feedback}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Evidence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedEvaluation.evidence}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Evaluated Traces ({selectedEvaluation.traceList.length})</CardTitle>
                  <CardDescription>Traces that were evaluated in this run</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEvaluation.traceList.map((trace) => (
                      <Link
                        key={trace.id}
                        href={`/traces/${trace.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {getStatusIcon(trace.status)}
                          <div>
                            <p className="font-medium text-sm group-hover:text-primary transition-colors">
                              {trace.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">{trace.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-mono font-medium">
                            {(trace.score * 100).toFixed(0)}%
                          </span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    handleRerun(selectedEvaluation.id);
                    setShowModal(false);
                  }}
                >
                  <Play className="h-4 w-4" />
                  Rerun Evaluation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
