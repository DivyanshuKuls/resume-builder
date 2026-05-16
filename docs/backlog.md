# Engineering Backlog

Priority levels: **P0** = critical · **P1** = core improvements · **P2** = architecture · **P3** = future/advanced

---

## Completed Milestones

These foundational items are done and inform current backlog priorities.

- Registry-based section rendering (`SECTION_RENDERERS`, `SECTION_EDITORS`)
- Zustand persist store with schema migration (v3)
- dnd-kit drag-and-drop for both sections and entry cards
- Theme system: presets → token computation → CSS variable injection
- Semantic CSS class system (`rt-*` classes, no hardcoded Tailwind in renderers)
- Print/PDF via `react-to-print` with A4 page layout and break rules
- Responsive layout: side-by-side desktop, tab-switched mobile
- Import/export JSON (`importExport.ts`)
- `sectionContent.ts` as single source of truth for content detection
- `useResume` / `useResumeActions` hook abstraction layer
- `uiStore` isolation of ephemeral UI state
- Custom sections (UUID-keyed, markdown content)
- Skills dual-mode: individual flat list vs. grouped categories
- Toast notifications
- localStorage persistence with `updatedAt` timestamp tracking
- **Testing infrastructure**: Vitest + React Testing Library + Playwright configured
- **Unit test suites**: `sectionContent.ts`, `computeThemeCSSVars`, `resumeStore` (all actions), `importExport.ts`, `validate.ts`
- **Component tests**: `SectionRenderer`, `SkillRenderer`, `PreviewHeader`
- **E2E tests**: editor editing flow, drag-and-drop UI presence (`tests/e2e/`)
- **Test fixtures + builders**: 4 JSON fixtures + `resumeBuilders.ts` factory functions
- **Testing strategy documentation**: `docs/testing-strategy.md`
- **Basic import validation**: `parseResumeJSON` validates structure, guards array fields, merges defaults
- **Error boundaries**: renderer crashes isolate per-section with fallback UI; editor crashes show a reload prompt without affecting the preview

---

## P0 — Critical Stability & Maintainability

### Runtime Schema Validation

- [ ] Add Zod schema for deep field-level validation of imported resume data (array items, nested objects)
- [ ] Validate on store hydration (catch stale localStorage shapes that migration didn't cover)

> Basic structural validation is in place: `parseResumeJSON` checks `personalInfo` presence, guards all array fields, and merges defaults. Deep item-level type guards and hydration validation remain.

---

## P1 — Core Product Improvements

### Import Pipeline

- [ ] Build PDF text-extraction parser (pdfjs-dist) for importing existing resumes
- [ ] Build plain-text / pasted-text parser with heuristic section detection
- [ ] Build LinkedIn profile import (HTML copy-paste → structured resume)
- [ ] Add import UI: drag-and-drop file zone + paste-text tab
- [ ] Display field-level parse confidence and allow user correction before committing

### Editor UX

- [ ] Show per-section word count / character count in editors
- [ ] Add "focus mode" that hides nav and expands form area
- [ ] Auto-save indicator (derived from `updatedAt` timestamp)
- [ ] Undo/redo support (via Zustand middleware or immer patches)
- [ ] Keyboard shortcut to jump between sections (e.g., `Ctrl+]` next section)
- [ ] Text box to apply multiple bullet points

### Preview Fidelity

- [ ] Add overflow / page-break indicator when content exceeds one A4 page
- [ ] Show page count badge in preview toolbar
- [ ] Add optional photo frame shape options (circle, rounded square)

### Section Management

- [ ] Duplicate existing section (copy all entries)
- [ ] "Reset to sample" per section
- [ ] Section-level notes field (stored but not rendered — for user reference)

---

## P2 — Architecture Improvements

### Zustand Store Refactor

- [ ] Split `resumeStore.ts` into domain slices (personal, contact, sections, theme, skills, entries)
- [ ] Compose slices with `immer` middleware for immutability guarantees
- [ ] Add store selectors module to co-locate derived state logic with the store

### Renderer Virtualization

- [ ] Investigate `react-window` or scroll-anchoring for long preview sections
- [ ] Profile re-render frequency when editing large Experience/Projects lists

### Theme System Extension

- [ ] Add border-radius scale to `ResumeTheme` (currently hardcoded per-component)
- [ ] Expose heading alignment option (`center` vs `left` for name/section headings)
- [ ] Allow custom color palette upload (import from image)

### Component Extraction

- [ ] Extract `EntryCard` date-range rendering into a shared `DateRange` component
- [ ] Extract link rendering (contact, project URLs) into a shared `ExternalLink` component
- [ ] Consolidate duplicate bullet-list rendering between `BulletListEditor` and renderers

### Type System

- [ ] Replace string literal `SectionType` union with a generated enum or `as const` map
- [ ] Add `SectionMeta` type for `SECTION_TYPE_META` entries (currently inferred)
- [ ] Narrow `CustomSection.content` — currently `string`, could be `MarkdownContent` branded type

---

## P3 — Future / Advanced Features

### Template System

- [ ] Define `ResumeTemplate` interface (layout grid, section placement, font pairing)
- [ ] Build template switcher that preserves data but swaps layout + theme
- [ ] At least two distinct layout templates: single-column and sidebar-column

### AI Integration

- [ ] AI-assisted bullet point rewriting (improve phrasing for impact)
- [ ] AI summary generation from experience entries
- [ ] Job description matching: highlight resume keywords that match a job posting

### Collaboration & Cloud

- [ ] Shareable read-only preview link (URL-encoded compressed JSON)
- [ ] Named resume versions / snapshots
- [ ] Cloud sync backend (auth + storage — would require API layer)

### Export Extensions

- [ ] DOCX export via `docx` npm package
- [ ] HTML export (self-contained file with embedded CSS)
- [ ] ATS-safe plain text export (strips formatting, preserves structure)

### Performance & Scalability

- [ ] Lazy-load section editors (dynamic imports via React.lazy)
- [ ] Lazy-load section renderers for unused section types
- [ ] Profile and benchmark full re-render cycle on 10+ section resumes
