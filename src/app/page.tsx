"use client";

import { useState } from "react";
import {
  GitBranch,
  Stethoscope,
  Loader2,
  Shield,
  Zap,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HealthGauge } from "@/components/health-gauge";
import {
  SecurityCard,
  PerformanceCard,
  DocsCard,
} from "@/components/agent-cards";
import { CriticalFix } from "@/components/critical-fix";

interface AnalysisResult {
  health_score: number;
  security_agent: {
    vulnerabilities: string[];
    risk_level: string;
  };
  performance_agent: {
    optimizations: string[];
    complexity_impact: string;
  };
  documentation_agent: {
    suggested_readme: string;
    summary: string;
  };
  critical_fix: string;
}

const SAMPLE_DIFF = `diff --git a/src/auth.js b/src/auth.js
index 1a2b3c4..5d6e7f8 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -1,10 +1,15 @@
-const API_KEY = "sk-1234567890abcdef";
+const API_KEY = process.env.API_KEY;
 
 function login(username, password) {
-  const query = "SELECT * FROM users WHERE name='" + username + "'";
-  return db.execute(query);
+  const query = "SELECT * FROM users WHERE name = $1";
+  return db.execute(query, [username]);
 }
 
+function fetchAllUsers() {
+  const users = db.getAll("users");
+  for (let i = 0; i < users.length; i++) {
+    for (let j = 0; j < users.length; j++) {
+      if (users[i].id === users[j].managerId) {
+        users[i].reports = users[i].reports || [];
+        users[i].reports.push(users[j]);
+      }
+    }
+  }
+  return users;
+}`;

export default function Home() {
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!diff.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      setResult(data);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
              <Stethoscope className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Agentic Git-Doctor
              </h1>
              <p className="text-xs text-muted-foreground">
                Multi-agent AI code review
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-red-400" /> Security
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="size-3.5 text-yellow-400" /> Performance
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-blue-400" /> Docs
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Input Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <GitBranch className="size-5 text-emerald-500" />
                Paste Your Diff
              </h2>
              <p className="text-sm text-muted-foreground">
                Paste a Git diff below and the AI agents will analyze it for
                security, performance, and documentation concerns.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDiff(SAMPLE_DIFF)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Load sample diff
            </Button>
          </div>

          <textarea
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
            placeholder={`diff --git a/file.js b/file.js\n--- a/file.js\n+++ b/file.js\n@@ -1,5 +1,7 @@\n-old line\n+new line`}
            className="w-full h-64 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 resize-y"
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={loading || !diff.trim()}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Stethoscope className="size-4" />
                  Analyze Diff
                </>
              )}
            </Button>
            {diff.trim() && !loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDiff("");
                  setResult(null);
                  setError(null);
                }}
                className="text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <section className="space-y-8 animate-in fade-in duration-500">
            {/* Health Score */}
            <div className="flex flex-col items-center py-4">
              <HealthGauge score={result.health_score} />
            </div>

            {/* Agent Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <SecurityCard data={result.security_agent} />
              <PerformanceCard data={result.performance_agent} />
              <DocsCard data={result.documentation_agent} />
            </div>

            {/* Critical Fix */}
            {result.critical_fix && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Most Urgent Fix</h3>
                <CriticalFix code={result.critical_fix} />
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-16 space-y-3">
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-zinc-800/50">
              <Stethoscope className="size-8 text-zinc-500" />
            </div>
            <p className="text-muted-foreground text-sm">
              Paste a Git diff above and click &quot;Analyze Diff&quot; to start.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-muted-foreground">
          Agentic Git-Doctor &mdash; Powered by Gemini 1.5 Flash
        </div>
      </footer>
    </div>
  );
}
