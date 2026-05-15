# Post-Feature Sync Prompt Template

Use this prompt to kick off a documentation sync session after completing a meaningful engineering milestone. Copy, fill in the bracketed fields, and paste into the AI session.

---

```
You are assisting with a post-feature documentation sync for the Resume Builder Platform.

## Context

Load these files before proceeding:
- .ai/context/project-summary.md        — architecture and priorities overview
- .ai/system/ai-engineering-rules.md    — strict architectural and process constraints
- .ai/workflows/post-feature-sync.md    — the documentation sync workflow to follow
- docs/backlog.md                       — current backlog state
- docs/changelog.md                     — completed milestones
- docs/roadmap.md                       — phase-level direction
- TECH_DEBT.md                          — known architectural gaps

## Completed Work

[Describe what was built or completed. Be specific:]
- What feature or subsystem was finished?
- What backlog items does this close?
- Did it introduce any known shortcuts or tech debt?
- Did it change the extension surface (registry contracts, store API, hook API)?

## Task

Follow the post-feature sync workflow defined in .ai/workflows/post-feature-sync.md.

Specifically:
1. Assess whether this milestone warrants documentation updates (it may not)
2. Draft a changelog entry if appropriate
3. Identify which backlog items to close, update, or remove
4. Identify any TECH_DEBT entries to add, update, or resolve
5. Determine whether roadmap.md or README.md need any changes (probably not)

## Constraints

- Follow .ai/system/ai-engineering-rules.md strictly — especially the "No Unnecessary Documentation Churn" rules
- Do not add changelog entries for implementation details
- Do not add backlog items speculatively
- Do not update the roadmap unless a Phase-level direction has changed
- Present your assessment before making any edits — ask for confirmation if scope is ambiguous
```
