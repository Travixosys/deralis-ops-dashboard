"use client";

import { useState } from "react";
import { Settings2, Plus, AlertTriangle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDemo } from "@/lib/demo-context";
import { cn } from "@/lib/utils";

export function DemoControls() {
  const [open, setOpen] = useState(false);
  const { simulateNewJob, simulateIssue, resetData } = useDemo();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <Card className="w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Demo Controls</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  simulateNewJob();
                }}
              >
                <Plus className="h-4 w-4 text-blue-500" />
                Simulate New Job
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  simulateIssue();
                }}
              >
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Simulate Issue
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => {
                  resetData();
                }}
              >
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                Reset Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating trigger button */}
      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-105",
          open && "rotate-45"
        )}
        onClick={() => setOpen(!open)}
      >
        <Settings2 className="h-4 w-4" />
        <span className="sr-only">Demo Controls</span>
      </Button>
    </div>
  );
}
