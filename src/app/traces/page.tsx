
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { api, Trace, Observation } from "@/lib/api";

export default function TracesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  const [traces, setTraces] = useState<Trace[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]); // We might need a separate API for ALL observations if we want to show them in the tab, but for now let's leave it empty or fetch some.
  // The current API endpoint `getTraces` only returns traces. `getTraceObservations` is for a single trace.
  // The original mock data had a huge list of all observations. 
  // For this demo, let's just focus on getting Traces working well first, and maybe we can fetch observations for the visible traces if needed, or just leave the Observations tab as "Under Construction" or similar if we don't have a "get all observations" endpoint (though we could add one).
  // Actually, I'll update the component to just fetch Traces for now. 

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tracesData, observationsData] = await Promise.all([
            api.getTraces(100, 0, searchQuery),
            api.getObservations(100, 0, searchQuery)
        ]);
        setTraces(tracesData);
        setObservations(observationsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pagination logic (Client side pagination for the 100 fetched records)
  const totalPages = Math.ceil(traces.length / rowsPerPage);
  const currentTraces = traces.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  
  const formatCost = (cost: number) => `$${cost.toFixed(5)}`;
  const formatLatency = (lat: number) => `${lat.toFixed(2)}s`;

  // Helper for Observation latency
  const getObsLatency = (start: string, end: string) => {
      const s = new Date(start).getTime();
      const e = new Date(end).getTime();
      return ((e - s) / 1000).toFixed(2) + "s";
  }

  // Helper for Observation Cost (Rough estimate)
  const getObsCost = (obs: Observation) => {
      const total = (obs.tokens_prompt || 0) + (obs.tokens_completion || 0);
      return formatCost(total * 0.000002);
  }

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Tracing
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            View and analyze all traces and observations
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="traces" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traces">Traces</TabsTrigger>
          <TabsTrigger value="observations">Observations</TabsTrigger>
        </TabsList>

        <TabsContent value="traces" className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Hide filters
            </Button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="sm">
              IDs / Names
            </Button>
            <Button variant="outline" size="sm">
              1d
            </Button>
            <Button variant="outline" size="sm">
              Saved Views
            </Button>
            <Button variant="outline" size="sm">
              Columns
            </Button>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="w-10 align-middle">
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Timestamp ▼
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Name
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Input
                    </TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">
                      Output
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Latency
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Cost
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Tokens
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading traces...
                      </TableCell>
                    </TableRow>
                  ) : currentTraces.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No traces found matching your query
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentTraces.map((trace) => {
                       const env = trace.metadata?.env || trace.metadata?.environment || "prod";
                       const provider = trace.metadata?.cloudProvider;
                       const region = trace.metadata?.cloudRegion;

                       return (
                      <TableRow
                        key={trace.id}
                        className="hover:bg-muted/50 cursor-pointer border-b border-border/50"
                      >
                        <TableCell className="align-middle">
                          <Star className="h-4 w-4 text-muted-foreground hover:text-primary hover:fill-primary/20 cursor-pointer transition-all duration-200" />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground align-middle whitespace-nowrap pr-4">
                          {new Date(trace.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="align-middle">
                          <Link
                            href={`/traces/${trace.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {trace.name}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {env}
                            </Badge>
                            {/* Cloud provider badge */}
                            {provider && (
                              <>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  {provider.toUpperCase()}
                                </Badge>
                                {region && (
                                  <span className="text-xs text-muted-foreground">
                                    {region}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {trace.input}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {trace.output}
                          </p>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatLatency(trace.latency)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {formatCost(trace.total_cost)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {trace.total_token_count}
                        </TableCell>
                      </TableRow>
                    )})
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page
              </span>
              <Button variant="outline" size="sm">
                {rowsPerPage}
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {Math.max(1, totalPages)}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages || 1, currentPage + 1))
                  }
                  disabled={currentPage >= (totalPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages || 1)}
                  disabled={currentPage >= (totalPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observations" className="space-y-4">
             {/* Observations Table */}
          <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="font-semibold whitespace-nowrap">Timestamp ▼</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Name</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Type</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Model</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Input</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap">Output</TableHead>
                    <TableHead className="font-semibold text-right">Latency</TableHead>
                    <TableHead className="font-semibold text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                     <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Loading observations...
                      </TableCell>
                    </TableRow>
                  ) : observations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No observations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    observations.map((obs) => (
                      <TableRow
                        key={obs.id}
                        className="hover:bg-muted/50 cursor-pointer border-b border-border/50"
                      >
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(obs.start_time).toLocaleTimeString()}
                        </TableCell>
                        <TableCell className="font-medium">{obs.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                {obs.type}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{obs.model || "N/A"}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">{obs.input}</p>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">{obs.output}</p>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {getObsLatency(obs.start_time, obs.end_time)}
                        </TableCell>
                         <TableCell className="text-right font-mono text-sm">
                          {getObsCost(obs)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

