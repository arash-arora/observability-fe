
"use client";

import { TraceTree, Observation as TraceTreeObservation, ObservationType } from "@/features/traces/components/TraceTree";
import { ObservationDetail } from "@/features/traces/components/ObservationDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Share,
  Download,
  Clock,
  DollarSign,
  Zap,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useState, use, useEffect } from "react";
import { api, Trace, Observation } from "@/lib/api";

// Helper to build tree from flat list
const buildObservationTree = (observations: Observation[]): TraceTreeObservation[] => {
  const map = new Map<string, TraceTreeObservation>();
  
  // First pass: create nodes
  observations.forEach((obs) => {
    // Map DB type to UI type if needed, or default to SPAN
    let type: ObservationType = "SPAN";
    if (obs.type.toLowerCase().includes("generation") || obs.type.toLowerCase().includes("llm")) type = "GENERATION";
    if (obs.type.toLowerCase().includes("event")) type = "EVENT";

    // Format latency and cost
    const start = new Date(obs.start_time).getTime();
    const end = new Date(obs.end_time).getTime();
    const latency = ((end - start) / 1000).toFixed(2) + "s";
    const cost = obs.tokens_prompt ? `$${((obs.tokens_prompt + obs.tokens_completion) * 0.000002).toFixed(5)}` : undefined; // Rough est if cost missing

    map.set(obs.id, {
      id: obs.id,
      name: obs.name,
      type,
      startTime: obs.start_time,
      endTime: obs.end_time,
      latency,
      cost, // The DB observation needs better cost tracking, but we'll use what we have or estimate
      status: "success", // Defaulting to success as DB currently doesn't store per-obs status explicitly in seeded data, or we could infer
      input: obs.input,
      output: obs.output,
      children: [],
    });
  });

  const roots: TraceTreeObservation[] = [];

  // Second pass: link children
  observations.forEach((obs) => {
    const node = map.get(obs.id);
    if (!node) return;

    if (obs.parent_observation_id && map.has(obs.parent_observation_id)) {
      const parent = map.get(obs.parent_observation_id);
      parent!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

export default function TraceDetailPage({
  params,
}: {
  params: Promise<{ traceId: string }>;
}) {
  const { traceId } = use(params);
  const [selectedObservation, setSelectedObservation] =
    useState<TraceTreeObservation | null>(null);
  const [observationTree, setObservationTree] = useState<TraceTreeObservation[]>([]);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTraceData = async () => {
      setIsLoading(true);
      try {
        const [traceData, obsData] = await Promise.all([
          api.getTraceDetail(traceId),
          api.getTraceObservations(traceId)
        ]);
        
        setTrace(traceData);
        const tree = buildObservationTree(obsData);
        setObservationTree(tree);
        
        // Auto-select the first node if available
        if (tree.length > 0) {
           setSelectedObservation(tree[0]);
        }

      } catch (error) {
        console.error("Failed to fetch trace data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTraceData();
  }, [traceId]);

  const env = trace?.metadata?.env || trace?.metadata?.environment || "prod";

  if (isLoading) {
      return <div className="p-8 text-center text-muted-foreground">Loading trace details...</div>;
  }

  if (!trace) {
      return <div className="p-8 text-center text-muted-foreground">Trace not found.</div>;
  }

  return (
    <div className="space-y-4 h-full flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/traces">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Trace</h2>
              <Badge variant="outline" className="font-mono text-xs">
                {traceId}
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(trace.timestamp).toLocaleTimeString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {trace.latency.toFixed(2)}s
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${trace.total_cost.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">{env}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">
                ${trace.total_cost.toFixed(5)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {trace.total_token_count} tokens
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">
                {trace.latency.toFixed(2)}s
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Status: {trace.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className={`h-4 w-4 ${trace.status === 'success' ? 'text-green-500' : 'text-red-500'}`} />
              <Badge
                variant="default"
                className={`${trace.status === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
              >
                {trace.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs
        defaultValue="timeline"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="logs">Log View</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="flex-1 overflow-hidden mt-4">
          <div className="flex-1 overflow-hidden flex gap-4 h-full">
            <div className="shrink-0 w-3/5 overflow-hidden min-w-0">
              <Card className="h-full overflow-hidden flex flex-col">
                <CardHeader>
                  <CardTitle>Trace Timeline</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto w-full">
                  <TraceTree
                    observations={observationTree}
                    onSelectObservation={setSelectedObservation}
                    selectedId={selectedObservation?.id}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              {/* @ts-ignore - ObservationDetail types mismatch slightly but fields are compatible enough for display */}
              <ObservationDetail observation={selectedObservation} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs">
                {/* Placeholder logs - could be derived from observations start times */}
                <div className="text-muted-foreground">
                  [{new Date(trace.timestamp).toISOString()}] Starting trace execution...
                </div>
                {observationTree.map(obs => (
                     <div key={obs.id} className="text-muted-foreground">
                        [{new Date(obs.startTime).toISOString()}] Started {obs.name} ({obs.type})
                     </div>
                ))}
                <div className="text-green-500">
                  [{new Date(new Date(trace.timestamp).getTime() + trace.latency * 1000).toISOString()}] ✓ Trace completed
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full overflow-auto">
            <CardHeader>
              <CardTitle>Trace Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex gap-2">
                    {trace.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Information
                  </h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-mono">{trace.user_id}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Custom Metadata
                  </h4>
                  <div className="bg-muted/50 rounded-md p-3 font-mono text-xs">
                    <pre>
                      {JSON.stringify(trace.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
