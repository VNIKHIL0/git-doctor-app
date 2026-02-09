"use client";

import { Shield, Zap, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SecurityData {
  vulnerabilities: string[];
  risk_level: string;
}

interface PerformanceData {
  optimizations: string[];
  complexity_impact: string;
}

interface DocsData {
  suggested_readme: string;
  summary: string;
}

export function SecurityCard({ data }: { data: SecurityData }) {
  return (
    <Card className="border-red-500/30 bg-red-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Shield className="size-5" />
          Security Agent
        </CardTitle>
        <RiskBadge level={data.risk_level} />
      </CardHeader>
      <CardContent className="space-y-3">
        {data.vulnerabilities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No vulnerabilities found.</p>
        ) : (
          <ul className="space-y-2">
            {data.vulnerabilities.map((v, i) => (
              <li key={i} className="flex gap-2 text-sm text-red-300">
                <span className="text-red-500 shrink-0">*</span>
                {v}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function PerformanceCard({ data }: { data: PerformanceData }) {
  return (
    <Card className="border-yellow-500/30 bg-yellow-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Zap className="size-5" />
          Performance Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.optimizations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No optimizations suggested.</p>
        ) : (
          <ul className="space-y-2">
            {data.optimizations.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-yellow-300">
                <span className="text-yellow-500 shrink-0">*</span>
                {o}
              </li>
            ))}
          </ul>
        )}
        {data.complexity_impact && (
          <div className="pt-2 border-t border-yellow-500/20">
            <p className="text-xs text-muted-foreground">Complexity Impact</p>
            <p className="text-sm text-yellow-200 mt-1">{data.complexity_impact}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DocsCard({ data }: { data: DocsData }) {
  return (
    <Card className="border-blue-500/30 bg-blue-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <FileText className="size-5" />
          Documentation Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Summary</p>
          <p className="text-sm text-blue-200">{data.summary}</p>
        </div>
        {data.suggested_readme && (
          <div className="pt-2 border-t border-blue-500/20">
            <p className="text-xs text-muted-foreground mb-1">Suggested README Update</p>
            <p className="text-sm text-blue-200 whitespace-pre-wrap">{data.suggested_readme}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Low: "bg-green-500/20 text-green-400 border-green-500/30",
    Med: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    High: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  const cls = colorMap[level] ?? colorMap["Med"];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit ${cls}`}>
      Risk: {level}
    </span>
  );
}
