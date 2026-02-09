"use client";

import { useState } from "react";
import {
  symptoms,
  categories,
  getSymptomsByCategory,
  getDiagnosis,
  getSeverityColor,
  type Diagnosis,
} from "@/lib/git-diagnostics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ArrowLeft,
} from "lucide-react";

export function DiagnosticTool() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const diagnosis = selectedSymptom ? getDiagnosis(selectedSymptom) : null;

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (diagnosis && selectedSymptom) {
    return <DiagnosisResult diagnosis={diagnosis} onBack={() => setSelectedSymptom(null)} onCopy={handleCopy} copied={copied} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">What went wrong?</h2>
        <p className="text-muted-foreground">
          Select your symptom and get a step-by-step fix.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category} className="gap-4">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {getSymptomsByCategory(category).map((symptom) => (
                <button
                  key={symptom.id}
                  onClick={() => setSelectedSymptom(symptom.id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground border border-transparent hover:border-border"
                >
                  {symptom.label}
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DiagnosisResult({
  diagnosis,
  onBack,
  onCopy,
  copied,
}: {
  diagnosis: Diagnosis;
  onBack: () => void;
  onCopy: (text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to symptoms
      </button>

      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold tracking-tight">
            {diagnosis.title}
          </h2>
          <Badge
            variant="outline"
            className={getSeverityColor(diagnosis.severity)}
          >
            {diagnosis.severity} severity
          </Badge>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {diagnosis.explanation}
        </p>
      </div>

      {diagnosis.warning && (
        <div className="flex gap-3 p-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{diagnosis.warning}</p>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Steps to fix</h3>
        <ol className="space-y-3">
          {diagnosis.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Terminal className="size-5" />
            Commands
          </h3>
          <button
            onClick={() => onCopy(diagnosis.command)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent"
          >
            {copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {copied ? "Copied" : "Copy all"}
          </button>
        </div>
        <pre className="bg-zinc-950 text-zinc-100 rounded-lg p-4 text-sm leading-relaxed overflow-x-auto font-mono">
          <code>{diagnosis.command}</code>
        </pre>
      </div>
    </div>
  );
}
