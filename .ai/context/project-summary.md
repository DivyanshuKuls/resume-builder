# Project Summary — Resume Builder Platform

## What It Is

A fully client-side resume builder evolving into a configurable document rendering and composition platform. No backend. All state is localStorage-persisted via Zustand. PDF output uses the browser's native print engine.

---

## Architecture

### Registry-Based Section System

Two parallel registries keyed by `SectionType` — `SECTION_EDITORS` and `SECTION_RENDERERS`. Adding a section type means registering in both; nothing else changes. Dispatch is a single map lookup in `SectionEditor.tsx` and `SectionRenderer.tsx`.

Adding a section type requires touching: `types/resume.ts` (union), `SECTION_TYPE_META`, both registries, `resumeStore.ts` (actions), `sectionContent.ts` (content detection).

### Theme Token Pipeline

`ThemeSettings` → `computeThemeCSSVars()` → flat `Record<string, string>` of `--rt-*` CSS custom properties → injected as `style` on `.resume-paper`. All renderer components use `rt-*` semantic CSS classes — never hardcoded colors or Tailwind utilities. Renderers are completely theme-agnostic by construction.

### Zustand Store

- `resumeStore` — persisted, all resume data + CRUD actions. Schema version v3 with migration function.
- `uiStore` — session-only, accordion/expand state. Not persisted.
- Hook layer: `useResume()`, `useResumeActions()`, `useResumeSelectors()`. Components use `useResumeActions()` for stable action references.

### Drag-and-Drop

Two independent dnd-kit sortable contexts: section reorder (`SectionManager`) and entry reorder within sections (`SortableEntryList`). `SortableEntryList` uses a render-prop pattern. Activation: 8px pointer threshold, 150ms touch delay, keyboard arrow keys.

### Print/PDF

`react-to-print` → browser print dialog → `@media print` CSS swaps `.resume-paper` from 794px screen width to 210mm A4. `break-inside: avoid` on `.resume-entry` prevents mid-entry page splits. No server, no canvas — native print for text fidelity.

### Responsive Layout

CSS Grid in `AppLayout.tsx`. Desktop (≥768px): 46/54 split side-by-side. Mobile: tab switcher. Both panels always mounted — only visibility toggled to preserve component state.

### Content Detection

`src/utils/sectionContent.ts` → `hasSectionContent()` is the single canonical answer to "does this section have renderable content?" Used by both preview rendering (skip empty sections) and editor nav (filled-dot indicator).

---

## Current Priorities

**P0 — Critical**
- Error boundaries around `SectionRenderer` and `EditorPanel`
- Zod schema for deep field-level import validation + hydration validation
- (Testing infrastructure is complete)

**P1 — Core Improvements**
- Import pipeline: PDF, plain-text, LinkedIn
- Editor UX: undo/redo, auto-save indicator, focus mode, keyboard shortcuts
- Preview: overflow/page-break indicator, page count badge

**P2 — Architecture**
- Split monolithic `resumeStore.ts` into domain slices with immer
- Theme system extension (border-radius scale, heading alignment)
- Component extraction (DateRange, ExternalLink, bullet list consolidation)
- Type system hardening (derive `SectionType` from `SECTION_TYPE_META`)

---

## Testing Strategy

Stack: Vitest + React Testing Library (jsdom) + Playwright (E2E).

All test infrastructure lives under `tests/` — never inside `src/`.

```
tests/
  e2e/          Playwright specs (editor flow, drag-drop)
  unit/         Pure functions + Zustand store
  components/   RTL component tests
  fixtures/     4 JSON resume fixtures
  mocks/        Store reset helpers
  setup/        vitest.setup.ts
  utils/        renderWithProviders, resumeBuilders
```

Key conventions:
- Never mock the Zustand store — test it directly
- Use `data-testid`, ARIA roles, visible text — not class names
- Test data via builder functions (`tests/utils/resumeBuilders.ts`), not imports from `src/utils/defaults.ts`
- E2E tests clear localStorage before each test

---

## Engineering Philosophy

- Registry pattern for extensibility — new section types require no architectural changes
- Semantic token system — renderers describe meaning, themes own appearance
- Incremental improvement over rewrites
- Single source of truth per domain (`hasSectionContent`, `SECTION_TYPE_META`, `computeThemeCSSVars`)
- Production code stays in `src/`; tests in `tests/`; docs in `docs/`
- No backend dependency — entirely browser-native
