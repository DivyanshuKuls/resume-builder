# Resume Builder

A client-side resume builder with a live preview editor, theme customization, drag-and-drop section management, and browser-native PDF export.

---

## Features

- **Live split-pane editing** — editor and styled preview update in real time
- **Section management** — reorder, hide, delete, and rename any section via drag-and-drop
- **Entry management** — drag-and-drop reordering within each section
- **Theme system** — 4 presets (Classic, Modern, Minimal, Professional) with color, font, and spacing overrides
- **Print-to-PDF** — browser-native A4 PDF export with page-break safety rules
- **Import / export JSON** — portable resume data format with schema migration
- **Custom sections** — free-form markdown/text sections with editable titles
- **Skills dual-mode** — individual flat list or grouped categories
- **Responsive layout** — side-by-side on desktop, tab-switched on mobile
- **Persistent state** — all data auto-saved to `localStorage`

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite |
| State | Zustand 5 (persist middleware) |
| Drag-and-drop | dnd-kit |
| PDF export | react-to-print |
| Styling | Tailwind CSS 4 + semantic CSS variables |
| Icons | Lucide React |
| Form handling | react-hook-form |

---

## Setup

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## Testing

```bash
npm test                # Run unit + component tests (one-shot)
npm run test:watch      # Run in watch mode
npm run test:coverage   # Generate coverage report
npm run test:e2e        # Run Playwright E2E tests
npm run test:e2e:ui     # Playwright interactive UI mode
```

The test suite uses **Vitest** for unit and component tests, **React Testing Library** for component rendering, and **Playwright** for end-to-end browser tests.

### First-time Playwright setup

```bash
npx playwright install --with-deps chromium
```

E2E tests start the dev server automatically via `playwright.config.ts`.

See [`docs/testing-strategy.md`](docs/testing-strategy.md) for the full testing philosophy, folder layout, and contribution guide.

---

## Development Workflow

### Releasing a version

```bash
npm run release
```

The script will:

1. Show current `git status` so you can review what's staged
2. Prompt for a commit message — aborts if empty
3. Prompt for a tag (e.g. `v0.6.0`) — aborts if empty
4. Run `git add .`, `git commit`, `git tag`, `git push`, `git push --tags` in sequence, stopping on any failure

The script is in [`scripts/release.mjs`](scripts/release.mjs) and has no external dependencies.

---

## Project Structure

```
src/
├── types/resume.ts            # All TypeScript interfaces for the data schema
├── store/
│   ├── resumeStore.ts         # Persistent store — all resume data and actions
│   └── uiStore.ts             # Session store — ephemeral UI state (accordion)
├── hooks/useResume.ts         # Selector hooks over resumeStore
├── themes/                    # Token computation, presets, type definitions
├── preview/
│   ├── renderers/index.ts     # Section renderer registry (SECTION_RENDERERS)
│   └── renderers/*.tsx        # One renderer per section type
├── editor/
│   ├── sections/index.ts      # Section editor registry (SECTION_EDITORS)
│   └── sections/*.tsx         # One editor per section type
├── utils/
│   ├── sectionContent.ts      # hasSectionContent() — single source of truth
│   └── importExport.ts        # JSON import/export logic
└── index.css                  # Semantic rt-* CSS classes + print rules
```

---

## Usage

### Creating and managing sections

Open the **Manage Sections** panel from the editor sidebar. Built-in sections (Experience, Education, Skills, etc.) are listed by default. Use the **+ Add Section** button to add a custom free-text section.

### Drag-and-drop ordering

- In **Manage Sections**: drag the handle on the left of any section row to reorder it in the resume.
- Inside each section editor: drag the handle on each entry card to reorder items (experience jobs, education entries, etc.).

### Editing section titles

Click a section in the editor sidebar to open its editor. The section title is editable at the top of the form — it appears as the rendered heading in the preview.

### Theme customization

Open the **Theme** panel from the editor sidebar. Choose a preset and optionally override the primary color, heading color, accent color, font family, font scale, and spacing density. Changes apply instantly.

### Import / Export JSON

- **Export**: Click the download icon in the top header to save your resume as a `.json` file.
- **Import**: Click the upload icon to load a `.json` file and replace the current resume.

### Print / PDF export

Click the **Download PDF** button in the preview panel toolbar. This opens the browser print dialog — select "Save as PDF" and choose A4 paper size. The editor and header are hidden automatically in the print output.

---

## Architecture Highlights

### Registry-driven sections

Both editor and preview use a `Record<SectionType, Component>` map for dispatch. Adding a section type means registering it in both maps — no switch statements or conditionals.

### Semantic theme system

A token pipeline computes `--rt-*` CSS custom properties and applies them to `.resume-paper`. Renderer components use `rt-*` semantic classes only — they are theme-agnostic by construction.

### Browser-native PDF

PDF export uses the browser print dialog — no canvas conversion or server rendering. A4 page-break safety is handled entirely in CSS.

See [`docs/architecture.md`](docs/architecture.md) for the full system design.

---

## Documentation

| File | Contents |
|------|----------|
| [`docs/architecture.md`](docs/architecture.md) | System design, registry pattern, theme pipeline, store structure, drag-and-drop, print flow |
| [`docs/backlog.md`](docs/backlog.md) | Prioritized engineering backlog (P0–P3) |
| [`docs/roadmap.md`](docs/roadmap.md) | Phase-by-phase future roadmap |
| [`docs/changelog.md`](docs/changelog.md) | Development history by commit phase |
| [`TECH_DEBT.md`](TECH_DEBT.md) | Known architectural gaps, severity, and recommended solutions |

---

## AI-Assisted Engineering

This project uses structured AI workflow files to preserve architecture consistency and documentation quality across AI-assisted sessions.

| File | Role |
|------|------|
| [`CLAUDE.md`](CLAUDE.md) | Persistent guidance for Claude-assisted engineering |
| [`AGENTS.md`](AGENTS.md) | Architecture principles and constraints for AI agents |
| [`.ai/system/`](.ai/system/) | Strict engineering rules — architecture, testing, documentation |
| [`.ai/workflows/`](.ai/workflows/) | Post-feature sync and documentation update workflows |

These files ensure AI-assisted changes stay architecturally consistent, avoid documentation drift, and support scalable engineering workflows.

---

## Roadmap Summary

- **Phase 1** — Testing infrastructure, error boundaries, runtime schema validation, text/paste import
- **Phase 2** — Page overflow detection, sidebar-column layout template, undo/redo
- **Phase 3** — AI-assisted writing, PDF import, shareable links, named snapshots
- **Phase 4** — DOCX/HTML export, cloud sync, template marketplace

---

## Contributing

The codebase is organized to make section-level additions self-contained. The checklist for adding a new section type:

1. Add the type to `SectionType` in `src/types/resume.ts`
2. Add an entry to `SECTION_TYPE_META` (icon, label, default title)
3. Create `src/editor/sections/ExampleEditor.tsx` implementing `SectionEditorProps`
4. Create `src/preview/renderers/ExampleRenderer.tsx` implementing `RendererProps`
5. Register both in `src/editor/sections/index.ts` and `src/preview/renderers/index.ts`
6. Add store actions in `resumeStore.ts`
7. Add content detection in `src/utils/sectionContent.ts`

Use `rt-*` semantic classes in renderers — do not add Tailwind utilities to preview output. Check `TECH_DEBT.md` before touching the store, theme system, or print CSS.
