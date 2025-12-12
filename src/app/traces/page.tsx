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
import { useState } from "react";

import { TRACES_DATA, OBSERVATIONS_DATA } from "@/lib/mock-data-v2";

export default function TracesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter traces based on search
  const filteredTraces = TRACES_DATA.filter(
    (trace) =>
      trace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.output.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trace.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTraces.length / rowsPerPage);
  const currentTraces = filteredTraces.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Filter observations based on search
  const [obsSearchQuery, setObsSearchQuery] = useState("");
  const filteredObservations = OBSERVATIONS_DATA.filter(
    (obs) =>
      obs.name.toLowerCase().includes(obsSearchQuery.toLowerCase()) ||
      obs.type.toLowerCase().includes(obsSearchQuery.toLowerCase()) ||
      obs.traceId.toLowerCase().includes(obsSearchQuery.toLowerCase())
  );

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
              Past 1 day
            </Button>
            <Button variant="outline" size="sm">
              Saved Views
            </Button>
            <Button variant="outline" size="sm">
              Columns 20/32
            </Button>
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table>
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
                  {currentTraces.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No traces found matching your query
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentTraces.map((trace) => (
                      <TableRow
                        key={trace.id}
                        className="hover:bg-muted/50 cursor-pointer border-b border-border/50"
                      >
                        <TableCell className="align-middle">
                          <Star className="h-4 w-4 text-muted-foreground hover:text-primary hover:fill-primary/20 cursor-pointer transition-all duration-200" />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground align-middle whitespace-nowrap pr-4">
                          {trace.timestamp}
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
                              {trace.environment}
                            </Badge>
                            {/* Cloud provider badge */}
                            {trace.cloudProvider && (
                              <>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-normal"
                                >
                                  {trace.cloudProvider.toUpperCase()}
                                </Badge>
                                {trace.cloudRegion && (
                                  <span className="text-xs text-muted-foreground">
                                    {trace.cloudRegion}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {trace.input}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {trace.output}
                          </p>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {trace.latency}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {trace.cost}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          {trace.tokens}
                        </TableCell>
                      </TableRow>
                    ))
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
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="observations" className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search observations..."
                value={obsSearchQuery}
                onChange={(e) => setObsSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Observations Table */}
          <Card className="overflow-hidden">
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="w-10 align-middle">
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </TableHead>
                    <TableHead className="font-semibold">Timestamp</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold text-right">Latency</TableHead>
                    <TableHead className="font-semibold text-right">Cost</TableHead>
                    <TableHead className="font-semibold text-right">Trace ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No observations found matching your query
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredObservations.map((obs) => (
                      <TableRow
                        key={obs.id}
                        className="hover:bg-muted/50 cursor-pointer border-b border-border/50 transition-colors duration-200"
                      >
                        <TableCell>
                          <Star className="h-4 w-4 text-muted-foreground hover:fill-primary/20 cursor-pointer transition-all duration-200" />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {obs.timestamp}
                        </TableCell>
                        <TableCell className="font-medium">{obs.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{obs.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {obs.latency}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {obs.cost}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">
                          {obs.traceId}
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
