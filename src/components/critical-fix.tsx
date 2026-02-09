"use client";

import { useState } from "react";
import { Copy, Check, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CriticalFix({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={() => setOpen(!open)}
        variant="outline"
        className="gap-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/30 hover:text-emerald-300"
      >
        <Wrench className="size-4" />
        {open ? "Hide Critical Fix" : "One-Click Fix"}
      </Button>

      {open && (
        <div className="relative rounded-lg border border-emerald-500/30 bg-zinc-950">
          <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-500/20">
            <span className="text-xs font-medium text-emerald-400">Critical Fix</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="p-4 text-sm leading-relaxed overflow-x-auto font-mono text-zinc-100">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
