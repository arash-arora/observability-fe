"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Observation } from "./TraceTree";
import { Clock, Coins, Calendar, Activity } from "lucide-react";

interface ObservationDetailProps {
  observation: Observation | null;
}

export function ObservationDetail({ observation }: ObservationDetailProps) {
  if (!observation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground p-8 border bg-muted/30">
        <div className="text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Select an observation to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border bg-background flex flex-col overflow-hidden">
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="font-mono text-xs uppercase">
            {observation.type}
          </Badge>
          <Badge
            variant={
              observation.status === "success" ? "default" : "destructive"
            }
          >
            {observation.status}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold tracking-tight mb-2">
          {observation.name}
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {observation.latency}
          </div>
          {observation.cost && (
            <div className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              {observation.cost}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {observation.startTime}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {observation.input && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Input
            </h4>
            <div className="rounded-md bg-[#1e293b] text-slate-50 p-4 font-mono text-xs overflow-hidden">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(observation.input, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {observation.output && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Output
            </h4>
            <div className="rounded-md bg-[#1e293b] text-slate-50 p-4 font-mono text-xs overflow-hidden">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(observation.output, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Metadata
          </h4>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">ID</div>
                <div className="font-mono text-xs">{observation.id}</div>
                <div className="text-muted-foreground">Start Time</div>
                <div className="font-mono text-xs">{observation.startTime}</div>
                <div className="text-muted-foreground">End Time</div>
                <div className="font-mono text-xs">{observation.endTime}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
