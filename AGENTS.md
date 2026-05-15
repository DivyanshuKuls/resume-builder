# AGENTS.md — Resume Builder Platform

Project constraints and workflow conventions for AI agent tooling.

---

## Project

Fully client-side resume builder built with React, TypeScript, Vite, Zustand, Tailwind CSS v4, dnd-kit, and react-to-print. No backend. All state in localStorage. PDF output via browser native print engine.

Evolving toward a configurable document rendering and composition platform.

---

## Architecture Principles

### Registry-Based Section System

Two parallel component registries keyed by `SectionType`:
- `SECTION_EDITORS` (`src/editor/sections/index.ts`) — one editor component per section type
- `SECTION_RENDERERS` (`src/preview/renderers/index.ts`) — one renderer component per section type

Dispatch is a single map lookup. Do not introduce switch statements or conditional rendering as alternatives.

Adding a section type: update `SectionType` union, `SECTION_TYPE_META`, both registries, `resumeStore.ts` actions, and `sectionContent.ts`.

### Semantic Token System

All design tokens are `--rt-*` CSS custom properties. Computed by `computeThemeCSSVars()` in `src/themes/tokens.ts`, injected as a `style` prop on `.resume-paper`. Renderer components use `rt-*` CSS classes — never Tailwind color utilities or hardcoded values. Renderers are theme-agnostic by construction.

### Store Architecture

- `resumeStore` — persisted (localStorage, schema v3 with migrations), all resume data and mutations
- `uiStore` — session-only, accordion state
- Hook layer: `useResume()`, `useResumeActions()`, `useResumeSelectors()` — components use these, not the store directly

### Print/PDF

`react-to-print` → browser print dialog → `@media print` CSS applies A4 dimensions. `break-inside: avoid` on `.resume-entry` is load-bearing. Do not add canvas-based or server-side PDF generation.

### Drag-and-Drop

Two dnd-kit sortable contexts: `SectionManager` (section reorder) and `SortableEntryList` (entry reorder within sections). `SortableEntryList` uses render-props — do not create per-editor DnD implementations.

### Content Detection

`hasSectionContent()` in `src/utils/sectionContent.ts` is the single canonical answer to whether a section has renderable content. Used by preview (skip rendering) and editor nav (filled-dot indicator). Do not replicate this logic inline.

---

## Project Constraints

**Never:**
- Add Tailwind color utilities or inline color styles to renderer components
- Add switch/conditional dispatch as an alternative to registry lookup
- Unmount `EditorPanel` or `PreviewPanel` on mobile (visibility is CSS-toggled to preserve state)
- Couple theme values into renderer components as props
- Add `@media print` rules that conflict with `break-inside: avoid` on `.resume-entry`
- Mock the Zustand store in tests
- Import from `tests/` in production code

**Always:**
- New store actions must call `touch()` to update `resume.updatedAt`
- Use the hook layer to access the store in components
- Use `rt-*` semantic classes in renderers
- Add new section types to both registries and all supporting files

---

## Source Organization

```
src/          Production code only
tests/        All test infrastructure (unit, component, E2E)
docs/         Architecture and workflow documentation
.ai/          AI workflow context and prompts
examples/     Sample resume data
```

Do not add test utilities to `src/`. Do not add production logic to `tests/`.

---

## Documentation Workflow

| File | Role |
|------|------|
| `docs/backlog.md` | Active prioritized work — P0/P1/P2/P3 |
| `docs/changelog.md` | Completed milestones only |
| `TECH_DEBT.md` | Known compromises — severity, impact, recommended path |
| `docs/roadmap.md` | Phase-level future direction |
| `docs/architecture.md` | System design — update when contracts change |

After a meaningful feature completion:
1. Follow `.ai/workflows/post-feature-sync.md`
2. Use `.ai/prompts/post-feature-prompt.md` as the session template

Do not update changelog for implementation details, single bug fixes, or minor refactors.

---

## Testing

Stack: Vitest + React Testing Library + Playwright. All in `tests/`.

Key rules:
- Selectors: `data-testid`, ARIA roles, visible text — not CSS class names
- Test data: `tests/utils/resumeBuilders.ts` factory functions or `tests/fixtures/*.json`
- E2E: `page.evaluate(() => localStorage.clear())` before each test
- No assertions on exact colors or pixel values

```bash
npm test              # unit + component
npm run test:e2e      # Playwright E2E
npm run test:coverage # coverage report
```

---

## Current Engineering Priorities

**P0:** Error boundaries (`SectionRenderer`, `EditorPanel`), Zod deep validation on import + hydration  
**P1:** Import pipeline (PDF, plain-text, LinkedIn), editor UX (undo/redo, auto-save, focus mode), preview overflow indicators  
**P2:** Zustand slice refactor, theme system extension, component extraction, type system hardening  
