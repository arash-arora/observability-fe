"use client";

import { useState, useEffect } from "react";
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
  Activity,
  Eye,
  ExternalLink,
  Sparkles,
  Loader2,
  Play,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { promptOpsApi, type Prompt } from "@/lib/promptops-api";

export default function PromptOpsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluatingIds, setEvaluatingIds] = useState<Set<string>>(new Set());

  // Fetch prompts from API
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await promptOpsApi.getPrompts(100, 0);
      setPrompts(response.prompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async (promptId: string) => {
    setEvaluatingIds(prev => new Set(prev).add(promptId));
    try {
      const result = await promptOpsApi.evaluatePrompt(promptId);
      console.log("Evaluation result:", result);
      alert(`✓ ${result.message}`);
      // Refresh prompts to get updated data
      await fetchPrompts();
    } catch (error) {
      console.error("Failed to evaluate prompt:", error);
      alert(`✗ Failed to evaluate prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setEvaluatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(promptId);
        return newSet;
      });
    }
  };

  const filteredPrompts = prompts.filter(
    (p) =>
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.model || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.systemMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalPrompts: prompts.length,
    highPerformers: prompts.filter(p => p.effectivenessScore >= 0.9).length,
    avgEffectiveness: prompts.length > 0 
      ? prompts.reduce((sum, p) => sum + p.effectivenessScore, 0) / prompts.length 
      : 0,
    totalExecutions: prompts.reduce((sum, p) => sum + p.executions, 0),
    totalCost: prompts.reduce((sum, p) => sum + p.avgCost, 0),
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            PromptOps
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Auto-discovered prompts from your traces - Monitor and evaluate performance
          </p>
        </div>
        <Button className="gap-2" onClick={fetchPrompts}>
          <Activity className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Prompts
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrompts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-discovered from traces
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Performers
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highPerformers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-600 font-medium">90%+ effectiveness</span>
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Executions
            </CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalExecutions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all prompts
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Effectiveness
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.avgEffectiveness * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall performance
            </p>
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
            placeholder="Search prompts by name, model, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Prompts Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Discovered Prompts ({filteredPrompts.length})</CardTitle>
          <CardDescription>
            System messages automatically extracted from your traces
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="font-semibold">Prompt Name</TableHead>
                    <TableHead className="font-semibold">System Message</TableHead>
                    <TableHead className="font-semibold">Model</TableHead>
                    <TableHead className="font-semibold">Trace Link</TableHead>
                    <TableHead className="font-semibold">Executions</TableHead>
                    <TableHead className="font-semibold">Effectiveness</TableHead>
                    <TableHead className="font-semibold">Last Evaluated</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No prompts discovered yet. Run the extraction job to discover prompts from traces.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrompts.map((prompt) => (
                      <TableRow
                        key={prompt.id}
                        className="hover:bg-muted/50 border-b border-border/50 transition-colors"
                      >
                        <TableCell className="font-medium max-w-[200px]">
                          <div className="truncate" title={prompt.name}>
                            {prompt.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {prompt.version}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="text-sm truncate" title={prompt.systemMessage}>
                            {prompt.systemMessage || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{prompt.model || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell>
                          {prompt.traceId ? (
                            <Link
                              href={`/traces/${prompt.traceId}`}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <span className="font-mono text-xs">
                                {prompt.traceId.substring(0, 12)}...
                              </span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {prompt.executions.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  prompt.effectivenessScore >= 0.9
                                    ? "bg-emerald-500"
                                    : prompt.effectivenessScore >= 0.7
                                    ? "bg-blue-500"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${prompt.effectivenessScore * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-mono font-medium">
                              {(prompt.effectivenessScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {prompt.lastEvaluatedAt
                            ? new Date(prompt.lastEvaluatedAt).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleEvaluate(prompt.id)}
                              disabled={evaluatingIds.has(prompt.id)}
                            >
                              {evaluatingIds.has(prompt.id) ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Evaluating...
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3" />
                                  Evaluate
                                </>
                              )}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Automatic Prompt Discovery
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Prompts are automatically discovered from your traces every 2 hours. System messages
                are extracted from observations and stored for analysis. Click "Evaluate" to run
                performance and effectiveness validation on any prompt.
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 Tip: The cron job runs automatically, but you can also manually trigger extraction
                by running: <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
                python3 -m app.jobs.extract_prompts
              </code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
