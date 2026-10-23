"use client";

import { useState } from "react";
import { Settings2, Plus, AlertTriangle, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { openJob, receiveRequest, resetDemo, simulateIncident } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DemoControls() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <Card className="w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Actions de démonstration</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpen(false)}>
                <X className="h-3.5 w-3.5" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => openJob(receiveRequest())}>
                <Plus className="h-4 w-4 text-blue-500" />
                Recevoir une demande client
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => simulateIncident()}>
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Simuler un incident
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={() => resetDemo()}>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                Réinitialiser les données
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        size="icon"
        variant="secondary"
        className={cn("h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-105", open && "rotate-45")}
        onClick={() => setOpen(!open)}
      >
        <Settings2 className="h-4 w-4" />
        <span className="sr-only">Actions de démonstration</span>
      </Button>
    </div>
  );
}
