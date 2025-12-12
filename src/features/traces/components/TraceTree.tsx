"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Clock, Coins, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type ObservationType = "SPAN" | "GENERATION" | "EVENT";

export interface Observation {
  id: string;
  name: string;
  type: ObservationType;
  startTime: string;
  endTime: string;
  latency: string;
  cost?: string;
  status: "success" | "error";
  input?: any;
  output?: any;
  children?: Observation[];
}

interface TraceTreeProps {
  observations: Observation[];
  onSelectObservation: (observation: Observation) => void;
  selectedId?: string | null;
}

const ObservationRow = ({
  observation,
  depth = 0,
  isLast = false,
  onSelect,
  selectedId,
}: {
  observation: Observation;
  depth?: number;
  isLast?: boolean;
  onSelect: (observation: Observation) => void;
  selectedId?: string | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = observation.children && observation.children.length > 0;
  const isSelected = selectedId === observation.id;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors border-2",
          isSelected 
            ? "bg-primary/10 border-primary" 
            : "border-transparent hover:bg-muted hover:border-primary/50"
        )}
        style={{ marginLeft: `${depth * 24}px` }}
        onClick={(e) => {
            e.stopPropagation();
            onSelect(observation);
        }}
      >
        <div 
            className="flex items-center justify-center w-4 h-4 shrink-0 hover:bg-muted rounded"
            onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
            }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="w-4" />
          )}
        </div>

        <Badge
          variant="outline"
          className={cn(
            "mr-2 h-6 shrink-0 font-mono text-[10px] uppercase tracking-wider",
            observation.type === "GENERATION" && "bg-[#1e293b] text-slate-50 border-[#1e293b]",
            observation.type === "SPAN" && "bg-muted text-muted-foreground border-border",
            observation.type === "EVENT" && "bg-orange-50 text-orange-700 border-orange-200"
          )}
        >
          {observation.type}
        </Badge>

        <span className="font-medium text-sm truncate flex-1">{observation.name}</span>

        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-1 w-16 justify-end">
            <Clock className="h-3 w-3" />
            {observation.latency}
          </div>
          {observation.cost && (
            <div className="flex items-center gap-1 w-16 justify-end">
              <Coins className="h-3 w-3" />
              {observation.cost}
            </div>
          )}
          <div className="w-6 flex justify-center">
             {observation.status === "success" ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
             ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
             )}
          </div>
        </div>
      </div>

      {isExpanded && hasChildren && (
        <div className="flex flex-col">
          {observation.children!.map((child, index) => (
            <ObservationRow
              key={child.id}
              observation={child}
              depth={depth + 1}
              isLast={index === observation.children!.length - 1}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function TraceTree({ observations, onSelectObservation, selectedId }: TraceTreeProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 overflow-x-auto h-full">
      <div className="min-w-[600px]">
        <div className="flex items-center justify-between px-2 py-2 border-b mb-2 text-xs font-medium text-muted-foreground">
            <div className="pl-8">Name</div>
            <div className="flex gap-4 pr-2">
                <div className="w-16 text-right">Latency</div>
                <div className="w-16 text-right">Cost</div>
                <div className="w-6 text-center">Status</div>
            </div>
        </div>
        {observations.map((obs) => (
          <ObservationRow 
            key={obs.id} 
            observation={obs} 
            onSelect={onSelectObservation}
            selectedId={selectedId}
          />
        ))}
      </div>
    </div>
  );
}
