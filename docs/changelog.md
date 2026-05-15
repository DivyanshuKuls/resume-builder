# Changelog

Structured by development phase, grouped from git history. All milestones were built on 2026-05-14 and 2026-05-15.

---

## [Unreleased]

Pending work tracked in [backlog.md](backlog.md).

---

## [0.5.0] — 2026-05-15

_Commit: `cca349d` — stabilize section titles and nested sortable entries_  
_Commit: `4a4ad5c` — code cleanup and refactoring_

### Added
- `useResume`, `useResumeSelectors`, `useResumeActions` hook abstraction over Zustand store
- `sectionContent.ts` — single source of truth for content detection (editor nav indicators, preview filtering, future validation)
- `uiStore.ts` — ephemeral UI state (accordion expanded entry per section), isolated from persisted data
- `src/editor/sections/types.ts` — explicit `SectionEditorProps` interface contract
- `src/editor/sections/index.ts` — editor registry barrel export

### Improved
- Section titles are now stable: editable per-section, stored in `SectionConfig.title`, rendered by `SectionHeading`
- `EntryCard` expanded/collapsed state is session-scoped (not persisted) — prevents stale UI on reload
- Editor nav shows filled-dot indicator for sections that have content

### Refactored
- Consolidated section editor dispatch into `SectionEditor.tsx` router
- `SortableEntryList` uses render-prop pattern — drag handle placement is flexible per editor
- Centralized `SECTION_TYPE_META` for icon, default title, and label per section type
- General cleanup pass across editor and preview components

---

## [0.4.0] — 2026-05-15

_Commit: `05d551f` — implement editor UX and interaction system_

### Added
- Drag-and-drop section reordering in `SectionManager` (dnd-kit)
- Drag-and-drop entry reordering within each section via `SortableEntryList`
- Three sensor stack: Pointer (8px activation threshold), Touch (150ms delay), Keyboard
- `restrictToVerticalAxis` + `restrictToParentElement` modifiers on all sortable contexts
- Section visibility toggle (hide without deleting)
- Section delete with order field renumbering
- `EditorNav` sidebar: fixed entries (Manage Sections, Theme) + dynamic section list
- `SectionManager` component: drag handle, visibility eye icon, delete action per section
- `EntryCard` collapsible container with drag handle slot

### Improved
- Pointer activation constraint (8px) prevents accidental drag on text selection and click
- Touch sensor delay ensures tap-to-expand doesn't trigger drag on mobile

### Fixed
- Section `order` field maintains contiguous integer sequence after delete

---

## [0.3.0] — 2026-05-14

_Commit: `0f5431c` — implement registry-based rendering and theme system_

### Added
- Theme preset system: Classic, Modern, Minimal, Professional (`src/themes/presets.ts`)
- `ThemeSettings` — user-facing shape: preset + optional color/font/scale overrides
- `computeThemeCSSVars()` — runtime engine: loads preset → applies overrides → returns flat CSS var map
- CSS variable injection onto `.resume-paper` via inline `style` prop
- `rt-*` semantic CSS classes in `index.css` — all renderers reference CSS vars, not hardcoded Tailwind
- `ThemeEditor` — preset picker, color pickers, font selector, font scale slider, spacing density slider
- `SectionHeading.tsx` — reusable section `<h2>` + horizontal rule, styled via `rt-section-*` classes
- `SectionRenderer.tsx` — dynamic registry lookup + alignment application wrapper

### Improved
- Theme changes apply instantly without re-mounting the preview
- Font and spacing scales are computed as multipliers on base token values

### Refactored
- Theme concern split into three files: `tokens.ts` (computation), `presets.ts` (data), `types.ts` (interfaces)
- All renderer components migrated from inline Tailwind to semantic `rt-*` classes

---

## [0.2.0] — 2026-05-14

_Commit: `13eedbf` — registry-based resume rendering engine_

### Added
- Registry-based section rendering: `SECTION_RENDERERS` (`src/preview/renderers/index.ts`)
- `RendererProps` interface — uniform contract for all renderer components
- Built-in section renderers: Summary, Experience, Education, Skills, Projects, Certifications, Achievements, Custom
- Skills dual-mode rendering: individual flat list vs. grouped categories (`SkillsConfig.mode`)
- Custom sections: UUID-keyed, markdown/text content, fully dynamic titles
- `ResumePreview.tsx` — orchestrates header, contact bar, and dynamic section iteration
- `PreviewHeader.tsx` — name, headline, photo
- `PreviewContact.tsx` — email, phone, links, address

### Added (Editor)
- All section editors: PersonalInfo, Contact, Summary, Experience, Education, Skills, Projects, Certifications, Achievements, Custom, Theme
- `SectionEditor.tsx` — registry dispatch router
- `BulletListEditor.tsx` — reusable array-of-strings editor
- `EmptyState.tsx` — empty section placeholder

---

## [0.1.0] — 2026-05-14

_Project foundation_

### Added
- Vite + React 19 + TypeScript scaffold
- Complete `Resume` type schema (`src/types/resume.ts`): PersonalInfo, ContactDetails, Experience, Education, Skill, SkillGroup, Project, Certification, Achievement, CustomSection, SectionConfig, ThemeSettings
- Zustand store (`resumeStore.ts`) with `persist` middleware and localStorage
- Schema migration system (version field + `migrate()` — currently at v3)
- `defaults.ts` — sample resume data for first-run
- `importExport.ts` — JSON export (Blob download) + JSON import (FileReader + store reset)
- `react-to-print` integration for PDF output
- A4 print CSS: `.resume-paper` dimensions, `@media print` rules, `break-inside`/`break-after` hints, `print-color-adjust: exact`
- Responsive `AppLayout`: desktop side-by-side (46%/54%), mobile tab switcher
- `AppHeader` with import, export, and print actions
- Shadcn-style UI primitives: Button, Input, Label, Textarea, Card, Badge, Separator
- `cn.ts` (clsx + tailwind-merge), `formatDate.ts`, `validate.ts`, `useToast.ts`
