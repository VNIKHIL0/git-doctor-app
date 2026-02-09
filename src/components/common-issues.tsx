"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { symptoms, diagnoses, getSeverityColor } from "@/lib/git-diagnostics";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CommonIssues() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Common Git Issues
        </h2>
        <p className="text-muted-foreground">
          Quick reference for the most frequent Git problems.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {symptoms.map((symptom) => {
          const diagnosis = diagnoses[symptom.id];
          if (!diagnosis) return null;
          return (
            <AccordionItem key={symptom.id} value={symptom.id}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-3 flex-wrap">
                  <span>{symptom.label}</span>
                  <Badge
                    variant="outline"
                    className={getSeverityColor(diagnosis.severity)}
                  >
                    {diagnosis.severity}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {diagnosis.explanation}
                  </p>
                  <div className="relative">
                    <button
                      onClick={() => handleCopy(symptom.id, diagnosis.command)}
                      className="absolute top-2 right-2 p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                    >
                      {copiedId === symptom.id ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                    <pre className="bg-zinc-950 text-zinc-100 rounded-lg p-4 pr-10 text-sm leading-relaxed overflow-x-auto font-mono">
                      <code>{diagnosis.command}</code>
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
