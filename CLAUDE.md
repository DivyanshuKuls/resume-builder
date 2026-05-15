# CLAUDE.md — Resume Builder Platform

Persistent guidance for Claude-assisted engineering on this project.

---

## Project Overview

Fully client-side resume builder evolving into a configurable document rendering and composition platform. React + TypeScript + Vite + Zustand + Tailwind CSS v4 + dnd-kit + react-to-print. No backend. All state in localStorage.

Detailed architecture: `docs/architecture.md`  
Current priorities: `docs/backlog.md`  
Technical debt: `TECH_DEBT.md`  
AI context: `.ai/context/project-summary.md`

---

## Architecture Philosophy

- **Registry-based extension**: new section types register in `SECTION_EDITORS` and `SECTION_RENDERERS` — no switch statements, no conditionals in dispatch paths
- **Semantic tokens, not hardcoded styles**: renderers use `rt-*` CSS classes; the theme pipeline (`computeThemeCSSVars`) controls appearance independently
- **Single sources of truth**: `hasSectionContent()` for content detection, `SECTION_TYPE_META` for section metadata, `computeThemeCSSVars()` for token computation
- **Native print, not canvas**: `react-to-print` + browser print engine for PDF — preserves text fidelity
- **Store layers**: `resumeStore` (persisted) + `uiStore` (session) + hook abstraction (`useResume`, `useResumeActions`, `useResumeSelectors`)

---

## Engineering Rules

Full rules: `.ai/system/ai-engineering-rules.md`

**Critical constraints:**
- Renderer components must use `rt-*` classes only — never Tailwind color utilities or inline color styles
- Registry dispatch in `SectionEditor.tsx` / `SectionRenderer.tsx` must stay a map lookup — not a switch
- `SortableEntryList.tsx` is the reusable nested sortable — do not create parallel DnD implementations per editor
- Both panels are always mounted on mobile (CSS visibility toggle) — do not unmount either
- `hasSectionContent()` is the canonical content check — do not inline equivalent logic in components
- New store actions must call `touch()` for `updatedAt` tracking
- Use hook layer (`useResumeActions`, `useResume`) — do not access the Zustand store directly in components

---

## What Not To Do

- Do not rewrite architecturally correct code for style preference
- Do not add abstractions for hypothetical future requirements
- Do not couple theme values into renderer components
- Do not add `@media print` rules that conflict with `break-inside: avoid` on `.resume-entry`
- Do not import from `tests/` in production code; do not add test utilities to `src/`
- Do not mock the Zustand store in tests — test it directly
- Do not add changelog entries for implementation details, minor fixes, or single-file refactors

---

## Documentation Conventions

| File | Contains |
|------|----------|
| `docs/backlog.md` | Pending prioritized work only — P0/P1/P2/P3 |
| `docs/changelog.md` | Completed milestones only — no in-progress entries |
| `TECH_DEBT.md` | Known architectural compromises — severity + recommended resolution |
| `docs/roadmap.md` | Phase-level future direction |
| `docs/architecture.md` | How the major systems work — update when contracts change |

After meaningful feature completion, follow the workflow in `.ai/workflows/post-feature-sync.md`.  
Use the prompt template in `.ai/prompts/post-feature-prompt.md` to start a sync session.

### README Governance

README is the project entry point — purpose, setup, structure, and high-level architecture only. Do not add deep implementation details, renderer/store internals, CSS class specifics, or workflow process content to README.

Full rules: `.ai/system/ai-engineering-rules.md` → **README Guidelines**

---

## Testing Conventions

Stack: Vitest + React Testing Library + Playwright. All tests live in `tests/` — never `src/`.

```
tests/
  e2e/          Playwright (editor.spec.ts, dragdrop.spec.ts)
  unit/         Pure functions + Zustand store actions
  components/   RTL component tests
  fixtures/     4 JSON resume fixtures
  utils/        resumeBuilders.ts (factory functions), renderWithProviders.tsx
  mocks/        Store reset helpers
  setup/        vitest.setup.ts
```

Run commands:
```bash
npm test              # unit + component (one-shot)
npm run test:watch    # watch mode
npm run test:coverage # coverage report
npm run test:e2e      # Playwright (auto-starts dev server)
```

Test rules:
- Use `data-testid`, ARIA roles, visible text — not CSS class names
- Test data via `resumeBuilders.ts` factory functions or `tests/fixtures/` JSON — not `src/utils/defaults.ts`
- E2E: clear localStorage with `page.evaluate(() => localStorage.clear())` before each test
- Do not assert on exact colors or pixel values
