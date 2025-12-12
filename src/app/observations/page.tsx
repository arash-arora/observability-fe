"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  generateTraces,
  generateObservationTree,
  TOTAL_TRACES,
} from "@/lib/mock-data";
import { Observation } from "@/features/traces/components/TraceTree";

export default function ObservationsPage() {
  const [query, setQuery] = useState("");
  const [observations, setObservations] = useState<Observation[]>([]);

  useEffect(() => {
    // Build a flat list of observations from all demo traces
    const traces = generateTraces(TOTAL_TRACES);
    const all: Observation[] = [];
    traces.forEach((t) => {
      const obs = generateObservationTree(t.id, t.name);
      obs.forEach((o) => {
        // push root and its children (TraceTree already nests children in 'children')
        const collect = (node: Observation) => {
          all.push({ ...node });
          if (node.children) node.children.forEach(collect);
        };
        obs.forEach(collect);
      });
    });

    // Deduplicate by id (safe-guard) and set state
    const byId = new Map<string, Observation>();
    all.forEach((o) => byId.set(o.id, o));
    setObservations(Array.from(byId.values()));
  }, []);

  const rows = observations.filter((o) => {
    if (!query) return true;
    return (
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.id.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Observations</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search observations..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Star className="h-4 w-4 text-muted-foreground" />
              </TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Latency</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Trace</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((o) => (
              <TableRow key={o.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell>
                  <Star className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {o.startTime}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/observations/${o.id}`}
                    className="font-medium hover:text-primary"
                  >
                    {o.name}
                  </Link>
                </TableCell>
                <TableCell>{o.type}</TableCell>
                <TableCell className="text-right font-mono">
                  {o.latency}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {o.cost || "-"}
                </TableCell>
                <TableCell className="text-right font-mono">{o.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
