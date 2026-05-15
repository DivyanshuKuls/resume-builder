# Architecture

This document describes the technical architecture of the resume builder — how the major systems fit together, why key decisions were made, and how to extend the system.

---

## System Overview

The resume builder is a fully client-side React application. There is no backend. All data lives in `localStorage` via Zustand persist middleware. PDF generation is handled entirely by the browser's native print engine.

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
│                                                                 │
│  ┌─────────────────────┐    ┌──────────────────────────────┐   │
│  │   Editor Panel      │    │      Preview Panel           │   │
│  │                     │    │                              │   │
│  │  EditorNav          │    │  ResumePreview               │   │
│  │  SectionManager     │    │    PreviewHeader              │   │
│  │  SectionEditor ─────┼────┼──► SectionRenderer (×N)      │   │
│  │    [registry]       │    │      [registry]              │   │
│  └────────┬────────────┘    └──────────────┬───────────────┘   │
│           │                                │                   │
│           └──────────┬─────────────────────┘                   │
│                      │                                         │
│          ┌───────────▼───────────┐                             │
│          │    Zustand Store      │                             │
│          │  resumeStore (persist)│                             │
│          │  uiStore (session)    │                             │
│          └───────────┬───────────┘                             │
│                      │                                         │
│                 localStorage                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── App.tsx                    # Root: print setup, layout composition
├── main.tsx
├── index.css                  # Global styles + theme CSS vars + print rules
│
├── types/
│   └── resume.ts              # All TypeScript interfaces for the data schema
│
├── store/
│   ├── resumeStore.ts         # Persistent Zustand store (all resume data + actions)
│   └── uiStore.ts             # Session-only store (accordion state)
│
├── hooks/
│   ├── useResume.ts           # Selector hooks over resumeStore
│   └── useToast.ts
│
├── themes/
│   ├── types.ts               # ResumeTheme, ThemeSettings interfaces
│   ├── presets.ts             # 4 built-in theme presets
│   ├── tokens.ts              # computeThemeCSSVars() — the token computation engine
│   └── index.ts
│
├── preview/
│   ├── PreviewPanel.tsx       # Container + print button toolbar
│   ├── ResumePreview.tsx      # Orchestrates header, contact, section loop
│   ├── SectionRenderer.tsx    # Registry lookup + alignment wrapper
│   ├── SectionHeading.tsx     # Semantic <h2> + rule for section titles
│   ├── sections/              # PreviewHeader, PreviewContact
│   └── renderers/
│       ├── types.ts           # RendererProps interface
│       ├── index.ts           # SECTION_RENDERERS registry
│       └── *.tsx              # One renderer per section type
│
├── editor/
│   ├── EditorPanel.tsx        # Editor layout (nav + form area)
│   ├── EditorNav.tsx          # Sidebar navigation
│   ├── SectionEditor.tsx      # Registry dispatch router
│   ├── SectionManager.tsx     # Drag-drop section reorder + visibility
│   ├── sections/
│   │   ├── types.ts           # SectionEditorProps interface
│   │   ├── index.ts           # SECTION_EDITORS registry
│   │   └── *.tsx              # One editor per section type
│   └── components/            # EntryCard, BulletListEditor, SortableEntryList
│
├── components/
│   ├── layout/                # AppLayout (grid), AppHeader
│   └── ui/                    # Primitive components (Button, Input, etc.)
│
└── utils/
    ├── sectionContent.ts      # hasSectionContent() — single source of truth
    ├── importExport.ts
    ├── formatDate.ts
    ├── defaults.ts
    ├── validate.ts
    └── cn.ts
```

---

## Registry-Based Section Architecture

The section system uses two parallel registries — one for editors, one for renderers. Both are keyed by `SectionType`.

### Why a registry?

Without a registry, dispatching to the right component requires a switch statement or a chain of conditionals that grows with every new section type. The registry makes the mapping explicit and extensible: adding a new section type means registering it in both maps and nowhere else.

### Editor Registry

```typescript
// src/editor/sections/index.ts
export const SECTION_EDITORS: Record<SectionType, ComponentType<SectionEditorProps>> = {
  summary:        SummaryEditor,
  experience:     ExperienceEditor,
  education:      EducationEditor,
  skills:         SkillsEditor,
  projects:       ProjectsEditor,
  certifications: CertificationsEditor,
  achievements:   AchievementsEditor,
  custom:         CustomSectionEditor,
}
```

`SectionEditor.tsx` reads `section.type` and looks up the component:

```typescript
const Editor = SECTION_EDITORS[section.type] ?? PlaceholderEditor
return <Editor section={section} />
```

### Renderer Registry

```typescript
// src/preview/renderers/index.ts
export const SECTION_RENDERERS: Record<SectionType, ComponentType<RendererProps>> = {
  summary:        SummaryRenderer,
  experience:     ExperienceRenderer,
  // ...
}
```

`SectionRenderer.tsx` does the same lookup for the preview side.

### Component Contracts

Both sides enforce a single-prop interface:

```typescript
// Every editor receives one prop
interface SectionEditorProps {
  section: SectionConfig
}

// Every renderer receives two props
interface RendererProps {
  resume: Resume
  section: SectionConfig
}
```

Renderers receive the full `resume` object because they may need data from multiple parts of the schema (e.g., `SkillRenderer` reads both `resume.skills` and `resume.skillGroups`).

### Adding a New Section Type

1. Add the type to `SectionType` in `src/types/resume.ts`
2. Add an entry to `SECTION_TYPE_META` (icon, label, default title)
3. Create `src/editor/sections/ExampleEditor.tsx`
4. Create `src/preview/renderers/ExampleRenderer.tsx`
5. Register both in their respective `index.ts` files
6. Add store actions for the new data in `resumeStore.ts`
7. Add content detection logic in `sectionContent.ts`

---

## Theme Token Pipeline

Theme application is a three-stage pipeline: definition → computation → injection.

```
ThemeSettings (user input)
      │
      ▼
computeThemeCSSVars()          ← src/themes/tokens.ts
      │   1. Load preset from THEME_PRESETS[settings.preset]
      │   2. Apply user overrides (primaryColor, headingColor, fontFamily, etc.)
      │   3. Scale font sizes by settings.fontScale
      │   4. Scale spacing by settings.spacingDensity
      │   5. Return flat Record<string, string> of CSS custom properties
      ▼
{ '--rt-color-primary': '#2563eb', '--rt-font-size-name': '28px', ... }
      │
      ▼
<div className="resume-paper" style={cssVars}>   ← ResumePreview.tsx
```

### Why CSS variables (not inline styles per component)?

If each component computed its own color from the theme object, changing the theme would require every renderer to re-render and recompute. CSS variables are inherited by all descendants automatically — a single style object on `.resume-paper` propagates to every `rt-*` class in the subtree with no React re-renders beyond the container.

### Semantic CSS Classes

All renderer components reference semantic `rt-*` classes, never hardcoded colors or Tailwind utilities:

```css
/* index.css */
.rt-name          { color: var(--rt-color-heading); font-size: var(--rt-font-size-name); }
.rt-entry-title   { color: var(--rt-color-heading); font-size: var(--rt-font-size-entry); }
.rt-section-rule  { border-color: var(--rt-color-accent); }
.rt-skill-pill    { background: var(--rt-color-pill-bg); color: var(--rt-color-pill-text); }
```

### Why decouple renderers from themes?

A renderer that hardcodes `text-blue-600` is implicitly coupled to one theme. Semantic classes mean a renderer is theme-agnostic by construction — it describes what a piece of text *is* (a job title, a section heading) not what it *looks like*. The theme decides appearance independently.

---

## Zustand Store Structure

### `resumeStore` — Persistent Store

Manages all resume data. Persisted to `localStorage` with a migration system.

```typescript
interface ResumeStoreState {
  resume: Resume          // The full resume data object
  activeSection: string   // Which section is selected in the editor
}

interface ResumeStoreActions {
  // Personal info, contact
  updatePersonalInfo(fields: Partial<PersonalInfo>): void
  updateContact(fields: Partial<ContactDetails>): void

  // Section management
  reorderSections(newOrder: SectionConfig[]): void
  toggleSectionVisibility(sectionId: string): void
  deleteSection(sectionId: string): void
  updateSectionTitle(sectionId: string, title: string): void

  // Entry CRUD (experience, education, projects, etc.)
  addExperience(entry: Experience): void
  updateExperience(id: string, fields: Partial<Experience>): void
  removeExperience(id: string): void
  reorderExperience(entries: Experience[]): void
  // ... same pattern for all list-based sections

  // Theme
  updateTheme(settings: Partial<ThemeSettings>): void

  // Import / reset
  loadResume(resume: Resume): void
  resetResume(): void
}
```

Every mutation calls `touch()` internally, which updates `resume.updatedAt` to the current ISO timestamp.

**Migration:** The `persist` middleware includes a `migrate(state, version)` function. When the schema changes, bump the version constant and add a migration branch. The current version is v3.

### `uiStore` — Session Store

Not persisted. Tracks UI state that should reset on page reload.

```typescript
interface UIStoreState {
  expandedEntries: Record<string, string | null>
  // key: sectionId, value: entryId of currently expanded card (null = all collapsed)
}
```

Isolating this prevents ephemeral UI state from bloating the persisted payload and avoids stale accordion state after data changes.

### Hook Abstraction

```typescript
useResume()           // Returns resume object — re-renders on any change
useResumeSelectors()  // Returns { activeSection } — shallow-compared, stable
useResumeActions()    // Returns all action functions — stable references
```

Components should use `useResumeActions()` rather than calling `useResume()` just to get actions — action references are stable and won't cause re-renders.

---

## Drag-and-Drop Architecture

dnd-kit provides two separate sortable contexts.

### Section Reordering (`SectionManager.tsx`)

Reorders the top-level section list. Each row has a drag handle, visibility toggle, and delete button.

```
DndContext (vertical, parent-constrained)
  └── SortableContext (sections array)
        └── SortableSection (×N)
              ├── DragHandle
              ├── Section title
              ├── Visibility toggle
              └── Delete button
```

### Entry Reordering (`SortableEntryList.tsx`)

Reorders entries within a section (experience items, education entries, etc.). Uses a render-prop pattern so each editor can place the drag handle wherever it fits in the card.

```
DndContext (vertical, parent-constrained)
  └── SortableContext (entries array)
        └── SortableItem (×N) — wraps EntryCard
              └── render({ dragHandleProps }) → editor's card layout
```

**Sensors used on both contexts:**

| Sensor | Activation |
|--------|-----------|
| Pointer | 8px movement threshold — prevents drag on text clicks |
| Touch | 150ms delay — prevents drag on tap |
| Keyboard | Arrow keys for accessibility |

**On drag end:** `arrayMove()` computes the new array, which is dispatched to the store action (`reorderSections`, `reorderExperience`, etc.).

---

## Print & PDF Rendering

### Flow

```
User clicks "Download PDF"
      │
      ▼
useReactToPrint({ contentRef: printRef })   ← App.tsx
      │
      ▼
Browser print dialog opens
      │
      ▼
@media print CSS activates:
  - .no-print elements removed (header, editor, toolbar)
  - .resume-paper: screen 794px → 210mm physical A4
  - print-color-adjust: exact (preserves background colors)
  - a[href]::after suppressed (no URL annotations)
      │
      ▼
Browser renders .resume-paper to PDF
```

### Page Break Rules

```css
.resume-section-heading { break-after: avoid; }   /* heading stays with first entry */
.resume-entry           { break-inside: avoid; }   /* entry never splits mid-page */
```

### Why native print (not canvas/puppeteer)?

Canvas-based approaches (html2canvas, puppeteer) require a server or a heavy client-side renderer and lose text fidelity. The native print engine renders exactly what the browser displays, respects CSS, and produces selectable text. The tradeoff is that page-break behavior depends on browser implementation — tested on Chrome.

---

## Import / Export

Both operations are in `src/utils/importExport.ts` and wired to `AppHeader`.

### Export

```
resumeStore.resume (object)
      │
      ▼
JSON.stringify(resume, null, 2)
      │
      ▼
Blob (application/json) → object URL → <a download> click
```

### Import

```
User selects .json file
      │
      ▼
FileReader.readAsText()
      │
      ▼
JSON.parse()
      │
      ▼
resumeStore.loadResume(parsed)  ← no validation currently (see TECH_DEBT.md)
```

**Known gap:** There is no schema validation on import. A malformed file can silently corrupt the store. Adding Zod validation before `loadResume()` is a P0 backlog item.

---

## Responsive Layout Strategy

`AppLayout.tsx` uses a CSS Grid approach with a breakpoint switch.

```
Desktop (md: ≥768px):
┌─────────────────────┬───────────────────────────┐
│   Editor Panel      │     Preview Panel          │
│   46% width         │     54% width              │
│   scrollable        │     scrollable             │
└─────────────────────┴───────────────────────────┘

Mobile (<768px):
┌─────────────────────────────────────────────────┐
│   Tab Bar: [ Edit ] [ Preview ]                 │
├─────────────────────────────────────────────────┤
│   Active panel (full width)                     │
└─────────────────────────────────────────────────┘
```

Both panels are always mounted — only visibility is toggled via CSS. This preserves component state (form inputs, scroll position) when switching tabs on mobile, without needing to serialize/restore state manually.

---

## Content Detection

`src/utils/sectionContent.ts` exports one function:

```typescript
hasSectionContent(resume: Resume, section: SectionConfig): boolean
```

This is the canonical answer to "does this section have any renderable content?" It is used in three places:

1. **Preview** — `ResumePreview.tsx` skips rendering sections where `hasSectionContent` returns false
2. **Editor nav** — `EditorNav.tsx` shows a filled-dot indicator for sections with content
3. **Future** — validation hints, export warnings

Having a single function prevents the editor nav and preview from drifting out of sync about what counts as "content."
