"use client";

import { useState } from "react";
import { Copy, Check, Search } from "lucide-react";

const commands = [
  { cmd: "git status", desc: "Show working tree status" },
  { cmd: "git log --oneline -10", desc: "Show last 10 commits (compact)" },
  { cmd: "git diff", desc: "Show unstaged changes" },
  { cmd: "git diff --staged", desc: "Show staged changes" },
  { cmd: "git stash", desc: "Stash current changes" },
  { cmd: "git stash pop", desc: "Apply and remove last stash" },
  { cmd: "git stash list", desc: "List all stashes" },
  { cmd: "git branch -a", desc: "List all branches (local + remote)" },
  { cmd: "git checkout -b <name>", desc: "Create and switch to new branch" },
  { cmd: "git merge <branch>", desc: "Merge branch into current" },
  { cmd: "git rebase <branch>", desc: "Rebase current onto branch" },
  { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keep staged" },
  { cmd: "git reset --hard HEAD~1", desc: "Undo last commit, discard all" },
  { cmd: "git reflog", desc: "Show history of HEAD changes" },
  { cmd: "git cherry-pick <hash>", desc: "Apply a specific commit" },
  { cmd: "git revert <hash>", desc: "Create commit undoing a commit" },
  { cmd: "git remote -v", desc: "Show remote repositories" },
  { cmd: "git fetch --all", desc: "Fetch all remotes" },
  { cmd: "git pull --rebase", desc: "Pull with rebase instead of merge" },
  { cmd: "git push --force-with-lease", desc: "Safe force push" },
  { cmd: "git clean -fd", desc: "Remove untracked files and dirs" },
  { cmd: "git bisect start", desc: "Start binary search for bad commit" },
  { cmd: "git blame <file>", desc: "Show who changed each line" },
  { cmd: "git tag -a v1.0 -m 'msg'", desc: "Create annotated tag" },
];

export function CommandReference() {
  const [search, setSearch] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filtered = commands.filter(
    (c) =>
      c.cmd.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  function handleCopy(idx: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Command Reference
        </h2>
        <p className="text-muted-foreground">
          Essential Git commands at your fingertips.
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search commands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-background px-9 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="grid gap-2">
        {filtered.map((c, i) => (
          <div
            key={c.cmd}
            className="flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:bg-accent/50 transition-colors group"
          >
            <div className="min-w-0 flex-1">
              <code className="text-sm font-mono font-medium">{c.cmd}</code>
              <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
            </div>
            <button
              onClick={() => handleCopy(i, c.cmd)}
              className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
            >
              {copiedIdx === i ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No commands match your search.
          </p>
        )}
      </div>
    </div>
  );
}
