export type Severity = "low" | "medium" | "high" | "critical";

export interface Symptom {
  id: string;
  label: string;
  category: string;
}

export interface Diagnosis {
  title: string;
  severity: Severity;
  explanation: string;
  steps: string[];
  command: string;
  warning?: string;
}

export const symptoms: Symptom[] = [
  { id: "merge-conflict", label: "I have merge conflicts", category: "Merging" },
  { id: "detached-head", label: "I'm in a detached HEAD state", category: "Branches" },
  { id: "undo-commit", label: "I need to undo my last commit", category: "Commits" },
  { id: "undo-push", label: "I pushed something I shouldn't have", category: "Commits" },
  { id: "lost-commits", label: "I lost my commits", category: "Recovery" },
  { id: "wrong-branch", label: "I committed to the wrong branch", category: "Branches" },
  { id: "large-file", label: "I accidentally committed a large file", category: "Files" },
  { id: "stash-lost", label: "I lost my stashed changes", category: "Recovery" },
  { id: "rebase-mess", label: "My rebase went wrong", category: "Rebasing" },
  { id: "diverged", label: "My branch has diverged from remote", category: "Branches" },
  { id: "untrack-file", label: "I want to stop tracking a file without deleting it", category: "Files" },
  { id: "amend-message", label: "I need to change a commit message", category: "Commits" },
  { id: "reset-file", label: "I want to discard changes in a specific file", category: "Files" },
  { id: "cherry-pick-conflict", label: "Cherry-pick caused conflicts", category: "Merging" },
  { id: "submodule-issue", label: "Submodules are out of sync", category: "Submodules" },
];

export const diagnoses: Record<string, Diagnosis> = {
  "merge-conflict": {
    title: "Merge Conflict Resolution",
    severity: "medium",
    explanation:
      "Merge conflicts occur when Git can't automatically reconcile changes between two branches. The conflicting sections are marked in your files with <<<<<<<, =======, and >>>>>>> markers.",
    steps: [
      "Open the conflicted files and look for conflict markers (<<<<<<<, =======, >>>>>>>)",
      "Edit each section to keep the code you want (remove the markers)",
      "Stage the resolved files with `git add <file>`",
      "Complete the merge with `git commit`",
      "If you want to abort the merge entirely, use `git merge --abort`",
    ],
    command: "git status  # See which files have conflicts\ngit diff     # View the conflicts\ngit add .    # After resolving, stage all\ngit commit   # Complete the merge",
  },
  "detached-head": {
    title: "Detached HEAD Recovery",
    severity: "high",
    explanation:
      "A detached HEAD means you're not on any branch. This usually happens when you checkout a specific commit, tag, or remote branch directly. Any commits you make in this state could be lost.",
    steps: [
      "If you have uncommitted changes you want to keep, stash them first",
      "Create a new branch from your current position to save your work",
      "Or checkout an existing branch to leave the detached state",
    ],
    command: "git branch temp-branch      # Save current work to a new branch\ngit checkout main            # Switch back to main\ngit merge temp-branch        # Merge your saved work",
    warning: "If you switch branches without saving, any commits made in detached HEAD will be difficult to recover.",
  },
  "undo-commit": {
    title: "Undo Last Commit",
    severity: "low",
    explanation:
      "You can undo your last commit while keeping your changes staged (soft reset) or unstaged (mixed reset). If the commit hasn't been pushed, this is completely safe.",
    steps: [
      "Use soft reset to undo the commit but keep changes staged",
      "Use mixed reset to undo the commit and unstage changes",
      "Use hard reset to completely discard the commit and all changes",
    ],
    command: "git reset --soft HEAD~1    # Undo commit, keep changes staged\ngit reset HEAD~1           # Undo commit, unstage changes\ngit reset --hard HEAD~1    # Undo commit AND discard changes",
    warning: "git reset --hard will permanently delete your changes. Use with caution.",
  },
  "undo-push": {
    title: "Undo a Pushed Commit",
    severity: "critical",
    explanation:
      "If you've already pushed a bad commit, you need to use `git revert` which creates a new commit that undoes the changes. Force-pushing a reset is risky if others have pulled.",
    steps: [
      "Use `git revert` to safely undo the commit with a new commit",
      "Push the revert commit to the remote",
      "Only use force-push as a last resort on branches no one else uses",
    ],
    command: "git revert HEAD             # Create a commit that undoes the last commit\ngit push                    # Push the revert\n\n# Nuclear option (DANGEROUS if others use this branch):\ngit reset --hard HEAD~1\ngit push --force-with-lease",
    warning: "Never force-push to shared branches like main/master without coordinating with your team.",
  },
  "lost-commits": {
    title: "Recover Lost Commits",
    severity: "high",
    explanation:
      "Git's reflog records every change to HEAD. Even if you accidentally reset or deleted a branch, the commits still exist for at least 30 days and can be recovered.",
    steps: [
      "Use `git reflog` to find the commit hash you want to recover",
      "Look for the entry that matches what you lost",
      "Create a new branch at that commit or cherry-pick it",
    ],
    command: "git reflog                          # Find the lost commit hash\ngit checkout -b recovery <hash>     # Create branch at that commit\n# OR\ngit cherry-pick <hash>              # Apply just that commit",
  },
  "wrong-branch": {
    title: "Committed to Wrong Branch",
    severity: "medium",
    explanation:
      "If you made commits on the wrong branch, you can move them to the correct branch using cherry-pick or by resetting the wrong branch.",
    steps: [
      "Note the commit hash(es) you want to move",
      "Switch to the correct branch",
      "Cherry-pick the commit(s) onto the correct branch",
      "Switch back to the wrong branch and reset it",
    ],
    command: "git log --oneline -5          # Find commit hashes to move\ngit checkout correct-branch\ngit cherry-pick <hash>        # Apply commits here\ngit checkout wrong-branch\ngit reset --hard HEAD~1       # Remove from wrong branch",
  },
  "large-file": {
    title: "Remove Large File from History",
    severity: "high",
    explanation:
      "A large file committed to Git will bloat the repository even after deletion. You need to rewrite history to fully remove it.",
    steps: [
      "If the commit hasn't been pushed, use reset to undo it",
      "Add the file to .gitignore to prevent future commits",
      "If already pushed, use git filter-branch or BFG Repo-Cleaner",
      "Force push the cleaned history (coordinate with your team)",
    ],
    command: "# If not yet pushed:\ngit reset --soft HEAD~1\necho 'large-file.zip' >> .gitignore\ngit add .gitignore\ngit commit -m 'Add large file to gitignore'\n\n# If already pushed (use BFG Repo-Cleaner):\n# bfg --delete-files large-file.zip\n# git reflog expire --expire=now --all\n# git gc --prune=now --aggressive\n# git push --force",
    warning: "Rewriting pushed history requires force-push and will affect all collaborators.",
  },
  "stash-lost": {
    title: "Recover Lost Stash",
    severity: "medium",
    explanation:
      "Dropped stashes can be recovered through Git's reflog and dangling commit detection. Stashes are stored as commits internally.",
    steps: [
      "List all unreachable commits that look like stash entries",
      "Inspect each one to find your lost changes",
      "Apply the recovered stash",
    ],
    command: "git fsck --unreachable | grep commit   # Find dangling commits\ngit show <hash>                        # Inspect each one\ngit stash apply <hash>                 # Apply the recovered stash",
  },
  "rebase-mess": {
    title: "Fix a Failed Rebase",
    severity: "high",
    explanation:
      "If a rebase goes wrong, you can abort it to return to the pre-rebase state. If you've already completed a bad rebase, the reflog can help you recover.",
    steps: [
      "If the rebase is still in progress, abort it",
      "If the rebase completed but is wrong, use reflog to find the pre-rebase state",
      "Reset to the pre-rebase commit",
    ],
    command: "git rebase --abort               # If rebase is in progress\n\n# If rebase already completed:\ngit reflog                       # Find pre-rebase HEAD\ngit reset --hard <pre-rebase-hash>",
  },
  "diverged": {
    title: "Fix Diverged Branch",
    severity: "medium",
    explanation:
      "Your local and remote branches have diverged when both have commits the other doesn't. You need to reconcile them with merge or rebase.",
    steps: [
      "Fetch the latest remote changes",
      "Choose between merge (preserves history) or rebase (linear history)",
      "Resolve any conflicts that arise",
      "Push the reconciled branch",
    ],
    command: "git fetch origin\n\n# Option 1: Merge (safe, preserves history)\ngit merge origin/main\n\n# Option 2: Rebase (cleaner history)\ngit rebase origin/main\n\ngit push",
  },
  "untrack-file": {
    title: "Stop Tracking a File",
    severity: "low",
    explanation:
      "To stop tracking a file in Git without deleting it from your working directory, use `git rm --cached`. Then add it to .gitignore.",
    steps: [
      "Remove the file from Git's index (not from disk)",
      "Add the file to .gitignore",
      "Commit the changes",
    ],
    command: "git rm --cached <file>           # Remove from tracking\necho '<file>' >> .gitignore      # Prevent future tracking\ngit add .gitignore\ngit commit -m 'Stop tracking <file>'",
  },
  "amend-message": {
    title: "Change Commit Message",
    severity: "low",
    explanation:
      "You can amend the most recent commit message easily. For older commits, you'll need an interactive rebase.",
    steps: [
      "For the last commit, use `git commit --amend`",
      "For older commits, use interactive rebase with `reword`",
      "If the commit was already pushed, you'll need to force push",
    ],
    command: "# Last commit:\ngit commit --amend -m 'New message'\n\n# Older commits (interactive rebase):\ngit rebase -i HEAD~3    # Change 'pick' to 'reword' for the target commit",
    warning: "Amending pushed commits requires force push and affects collaborators.",
  },
  "reset-file": {
    title: "Discard Changes in a File",
    severity: "low",
    explanation:
      "You can restore a specific file to its last committed state without affecting other files.",
    steps: [
      "Use `git checkout` or `git restore` to discard changes in a specific file",
      "For staged changes, unstage first then restore",
    ],
    command: "git restore <file>              # Discard unstaged changes\ngit restore --staged <file>     # Unstage a file\ngit checkout -- <file>          # Alternative (older Git versions)",
  },
  "cherry-pick-conflict": {
    title: "Resolve Cherry-Pick Conflicts",
    severity: "medium",
    explanation:
      "Cherry-pick conflicts happen when the commit you're applying doesn't cleanly apply to the current branch. The resolution is similar to merge conflicts.",
    steps: [
      "Resolve the conflict markers in the affected files",
      "Stage the resolved files",
      "Continue the cherry-pick",
      "Or abort if you want to cancel",
    ],
    command: "# Resolve conflicts in files, then:\ngit add <resolved-files>\ngit cherry-pick --continue\n\n# Or abort:\ngit cherry-pick --abort",
  },
  "submodule-issue": {
    title: "Fix Submodule Sync Issues",
    severity: "medium",
    explanation:
      "Submodules can get out of sync when the parent repo expects a different commit than what's checked out. This often happens after pulling changes.",
    steps: [
      "Update and initialize all submodules",
      "Sync the submodule URLs if they changed",
      "If a submodule is in detached HEAD, checkout the correct branch",
    ],
    command: "git submodule update --init --recursive   # Initialize & update\ngit submodule sync --recursive             # Sync URLs\ngit submodule foreach git checkout main     # Checkout branch in each",
  },
};

export const categories = [...new Set(symptoms.map((s) => s.category))];

export function getSymptomsByCategory(category: string): Symptom[] {
  return symptoms.filter((s) => s.category === category);
}

export function getDiagnosis(symptomId: string): Diagnosis | undefined {
  return diagnoses[symptomId];
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "low":
      return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950 dark:border-yellow-800";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950 dark:border-orange-800";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800";
  }
}
