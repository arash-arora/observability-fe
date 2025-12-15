"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  Workflow,
  Lightbulb,
  Database,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { api, Trace } from "@/lib/api";

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEvaluationCreated?: () => void;
}

const EVALUATION_TYPES = [
  {
    id: "agent",
    name: "Agent Evaluation",
    description: "Evaluate agent tool selection, input structure, and error recovery",
    icon: Bot,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    id: "workflow",
    name: "Workflow Evaluation",
    description: "Assess workflow completion, routing accuracy, and step efficiency",
    icon: Workflow,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
  {
    id: "explainability",
    name: "Explainability",
    description: "Evaluate reasoning clarity, decision transparency, and output justification",
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
  },
  {
    id: "rag",
    name: "RAG Evaluation",
    description: "Measure faithfulness, answer relevance, context precision, and recall",
    icon: Database,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
  },
];

export function CreateEvaluationDialog({
  open,
  onOpenChange,
  onEvaluationCreated,
}: CreateEvaluationDialogProps) {
  const [step, setStep] = useState<"types" | "traces" | "confirm">("types");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTraces, setSelectedTraces] = useState<string[]>([]);
  const [evaluationName, setEvaluationName] = useState("");
  const [traces, setTraces] = useState<Trace[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch traces when dialog opens
  useEffect(() => {
    if (open && step === "traces") {
      fetchTraces();
    }
  }, [open, step]);

  const fetchTraces = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTraces();
      // API returns an array directly, not an object with traces property
      setTraces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch traces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleTraceToggle = (traceId: string) => {
    setSelectedTraces((prev) =>
      prev.includes(traceId)
        ? prev.filter((id) => id !== traceId)
        : [...prev, traceId]
    );
  };

  const handleSelectAllTraces = () => {
    const filtered = getFilteredTraces();
    if (selectedTraces.length === filtered.length) {
      setSelectedTraces([]);
    } else {
      setSelectedTraces(filtered.map((t) => t.id));
    }
  };

  const getFilteredTraces = () => {
    if (!searchQuery) return traces;
    return traces.filter(
      (trace) =>
        trace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trace.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleNext = () => {
    if (step === "types") {
      setStep("traces");
    } else if (step === "traces") {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "traces") {
      setStep("types");
    } else if (step === "confirm") {
      setStep("traces");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Call the real API to create evaluation
      const response = await api.createEvaluation({
        name: evaluationName,
        evaluation_types: selectedTypes,
        trace_ids: selectedTraces,
      });
      
      console.log("Evaluation created:", response);
      
      onEvaluationCreated?.();
      handleClose();
    } catch (error) {
      console.error("Failed to create evaluation:", error);
      alert(`Failed to create evaluation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("types");
    setSelectedTypes([]);
    setSelectedTraces([]);
    setEvaluationName("");
    setSearchQuery("");
    onOpenChange(false);
  };

  const canProceed = () => {
    if (step === "types") return selectedTypes.length > 0;
    if (step === "traces") return selectedTraces.length > 0;
    if (step === "confirm") return evaluationName.trim().length > 0;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl md:min-w-4xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">Create New Evaluation</DialogTitle>
          <DialogDescription>
            {step === "types" && "Select one or more evaluation types to run"}
            {step === "traces" && "Choose traces to evaluate"}
            {step === "confirm" && "Review and confirm your evaluation"}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {/* Step 1: Select Evaluation Types */}
          {step === "types" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {EVALUATION_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedTypes.includes(type.id);
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeToggle(type.id)}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${type.bgColor}`}>
                          <Icon className={`h-5 w-5 ${type.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{type.name}</h3>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {selectedTypes.length > 0 && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Selected Evaluations:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map((typeId) => {
                      const type = EVALUATION_TYPES.find((t) => t.id === typeId);
                      return (
                        <Badge key={typeId} variant="secondary">
                          {type?.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Traces */}
          {step === "traces" && (
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search traces by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllTraces}
                >
                  {selectedTraces.length === getFilteredTraces().length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              {selectedTraces.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">
                    {selectedTraces.length} trace{selectedTraces.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
              )}

              <ScrollArea className="flex-1 border rounded-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Trace Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Latency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredTraces().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No traces found
                          </TableCell>
                        </TableRow>
                      ) : (
                        getFilteredTraces().map((trace) => (
                          <TableRow
                            key={trace.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleTraceToggle(trace.id)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedTraces.includes(trace.id)}
                                onCheckedChange={() => handleTraceToggle(trace.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{trace.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {trace.id}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  trace.status === "success"
                                    ? "default"
                                    : trace.status === "error"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {trace.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {trace.latency ? `${trace.latency.toFixed(2)}s` : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="eval-name">Evaluation Name</Label>
                <Input
                  id="eval-name"
                  placeholder="e.g., Production Agent Quality Check"
                  value={evaluationName}
                  onChange={(e) => setEvaluationName(e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Types ({selectedTypes.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map((typeId) => {
                      const type = EVALUATION_TYPES.find((t) => t.id === typeId);
                      const Icon = type?.icon || Bot;
                      return (
                        <div
                          key={typeId}
                          className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{type?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Selected Traces ({selectedTraces.length})</h4>
                  <ScrollArea className="h-48 border rounded-lg p-4">
                    <div className="space-y-2">
                      {selectedTraces.map((traceId) => {
                        const trace = traces.find((t) => t.id === traceId);
                        return (
                          <div
                            key={traceId}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded"
                          >
                            <div>
                              <p className="text-sm font-medium">{trace?.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {trace?.id}
                              </p>
                            </div>
                            <Badge variant="outline">{trace?.status}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Evaluation will run in the background
                    </p>
                    <p className="text-blue-700 dark:text-blue-300 mt-1">
                      You'll be notified when the evaluation completes. This may take a few minutes
                      depending on the number of traces and evaluation types selected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {step !== "types" && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              {step !== "confirm" ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Evaluation"
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
