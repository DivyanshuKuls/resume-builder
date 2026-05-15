# Post-Feature Documentation Sync Workflow

Run this workflow after completing a meaningful engineering milestone. Its purpose is to keep documentation accurate and useful without accumulating noise.

---

## When to Run This Workflow

Run after completing work that represents a **meaningful milestone**: a feature is usable, a subsystem is replaced, a P0/P1 backlog item is closed, or the architecture changes in a significant way.

**Do NOT run after:**
- A single bug fix that doesn't change behavior
- A refactor that is purely internal (no API or behavior change)
- A minor style or formatting change
- Adding a single test for an existing feature
- Updating a comment or renaming a variable

The question to ask: *"Would a returning developer, looking at the changelog two months from now, care about this?"* If no, skip.

---

## Step 1 — Assess What Changed

Before touching any documentation, answer:

1. What feature or system was completed?
2. Does it introduce or close any known technical debt?
3. Does it change how a developer extends the system (e.g., adds a registry contract, changes how section types work)?
4. Does it affect any currently open backlog items (closes one, unblocks another, makes one obsolete)?
5. Does it change the project's capabilities enough to warrant a README update?

---

## Step 2 — Update `docs/changelog.md`

Add a new entry **only if** this milestone represents a completed capability that someone would want to know about. Use this format:

```markdown
## [Short milestone name] — YYYY-MM-DD

Brief description of what was completed and why it matters architecturally.

- Specific capability 1
- Specific capability 2
- Architecture note if relevant (e.g., new registry contract, new store slice)
```

**Changelog rules:**
- Completed milestones only — no "in progress" entries
- One entry per meaningful milestone — not one per commit
- Architecture notes only when the extension surface changes
- Do not list internal implementation details (file names, function signatures) unless they define a contract

---

## Step 3 — Update `docs/backlog.md`

- Mark completed items as done or remove them from the active backlog
- If the feature revealed new work, add it at the appropriate priority level
- If a backlog item is now obsolete (superseded or no longer valid), remove it
- Do not add items that are already tracked elsewhere
- Do not inflate the backlog with speculative P3 ideas discovered during implementation — those belong in `docs/roadmap.md`

---

## Step 4 — Update `TECH_DEBT.md` (if applicable)

Update TECH_DEBT.md when:
- A known debt item was resolved — update or remove the entry
- The feature introduced a new known compromise (intentional shortcut, deferred validation, non-ideal abstraction) — add it with severity, impact, and recommended solution
- A debt item's severity changed based on new usage patterns

Do NOT add entries for:
- Cosmetic code style preferences
- General "this could be cleaner" observations
- Items that are already in the backlog

---

## Step 5 — Update `docs/roadmap.md` (rarely)

Update the roadmap only when:
- A Phase is substantially complete and the next Phase is now the active direction
- A significant architectural decision changes the planned approach for a Phase item
- A new Phase-level capability is validated and worth tracking

Do not update the roadmap for individual backlog items — that's what `docs/backlog.md` is for.

---

## Step 6 — Update `README.md` (rarely)

Update the README only when the project's external-facing capabilities change:
- A core user-facing feature is added (e.g., import pipeline, template switcher, sharing)
- Setup or usage instructions change
- A new export format is supported

Do not update the README for architectural improvements, testing additions, or internal refactors.

---

## What Good Looks Like

A well-run post-feature sync produces:
- One changelog entry (or none, if the milestone is too small)
- 1–3 backlog items closed or updated
- 0–1 TECH_DEBT entries added or resolved
- No roadmap or README changes (unless genuinely warranted)

A bad post-feature sync produces:
- A changelog entry for every commit
- Dozens of new backlog items added speculatively
- README rewritten for an internal refactor
- Roadmap updated with premature phase completions
