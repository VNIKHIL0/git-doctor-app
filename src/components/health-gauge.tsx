"use client";

export function HealthGauge({ score }: { score: number }) {
  const radius = 70;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  function getColor(s: number) {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#eab308";
    if (s >= 40) return "#f97316";
    return "#ef4444";
  }

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-zinc-800"
        />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          transform="rotate(-90 90 90)"
          className="transition-all duration-1000 ease-out"
        />
        <text
          x="90"
          y="82"
          textAnchor="middle"
          className="fill-current text-foreground"
          fontSize="36"
          fontWeight="bold"
          fontFamily="var(--font-geist-mono)"
        >
          {score}
        </text>
        <text
          x="90"
          y="105"
          textAnchor="middle"
          className="fill-current text-muted-foreground"
          fontSize="12"
        >
          Health Score
        </text>
      </svg>
      <p className="text-sm text-muted-foreground font-medium">
        {score >= 80
          ? "Looking healthy"
          : score >= 60
          ? "Needs attention"
          : score >= 40
          ? "Several issues found"
          : "Critical issues detected"}
      </p>
    </div>
  );
}
