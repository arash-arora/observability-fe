"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ObservationDetail } from "@/features/traces/components/ObservationDetail";
import {
  generateTraces,
  generateObservationTree,
  TOTAL_TRACES,
} from "@/lib/mock-data";
import { Observation } from "@/features/traces/components/TraceTree";
import Link from "next/link";

export default function ObservationDetailPage() {
  const params = useParams();
  const id = params?.observationId as string;
  const [observation, setObservation] = useState<Observation | null>(null);

  useEffect(() => {
    if (!id) return;
    const traces = generateTraces(TOTAL_TRACES);
    let found: Observation | null = null;
    traces.forEach((t) => {
      const obs = generateObservationTree(t.id, t.name);
      const visit = (node: Observation) => {
        if (node.id === id) {
          found = node;
        }
        if (node.children) node.children.forEach(visit);
      };
      obs.forEach(visit);
    });

    setObservation(found);
  }, [id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Observation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detail view for observation <span className="font-mono">{id}</span>
          </p>
        </div>
        <div>
          <Link
            href="/observations"
            className="text-sm text-muted-foreground underline"
          >
            Back to observations
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Observation Detail</CardTitle>
          <CardDescription>Full input, output and metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <ObservationDetail observation={observation} />
        </CardContent>
      </Card>
    </div>
  );
}
