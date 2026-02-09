import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Act as "Git-Doctor," a multi-agent technical review system. Analyze the following Git Diff and provide a specialized review from three perspectives: Security, Performance, and Documentation.

RESPONSE REQUIREMENTS:
You MUST return the response in a strict JSON format with the following keys:
1. "health_score": (Integer 0-100)
2. "security_agent": { "vulnerabilities": [], "risk_level": "Low/Med/High" }
3. "performance_agent": { "optimizations": [], "complexity_impact": "" }
4. "documentation_agent": { "suggested_readme": "", "summary": "" }
5. "critical_fix": "A code snippet to fix the most urgent issue found."

AGENT PERSONAS:
- Security: Scan for hardcoded credentials, SQL injection, and insecure dependencies.
- Performance: Identify O(n^2) loops, redundant API calls, or memory leaks.
- Documentation: Summarize the "why" behind the change, not just the "what."

STRICT RULE: Do not include any conversational text before or after the JSON. Return ONLY valid JSON.`;

export async function POST(req: NextRequest) {
  try {
    const { diff } = await req.json();

    if (!diff || typeof diff !== "string" || diff.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty diff is required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                { text: `DIFF DATA:\n${diff}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("Gemini API error:", response.status, errBody);
      return NextResponse.json(
        { error: `Gemini API returned ${response.status}` },
        { status: 502 }
      );
    }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

      // Try parsing directly, then try extracting JSON block
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Try extracting JSON from markdown code block
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1].trim());
        } else {
          // Try cleaning common issues: trailing commas, etc.
          const cleaned = text.replace(/,\s*([}\]])/g, "$1");
          parsed = JSON.parse(cleaned);
        }
      }

      return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Analyze route error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
