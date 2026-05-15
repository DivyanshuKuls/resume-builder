# Roadmap

Engineering-focused roadmap organized by phase. Each phase builds on the previous. Timelines are intentionally loose — this is a solo project evolving alongside use.

---

## Phase 1 — Stabilization & Robustness

**Goal:** Harden the existing architecture before adding new capabilities.

### 1.1 Testing Foundation
- Vitest + React Testing Library setup
- Unit tests for store actions, `computeThemeCSSVars`, `sectionContent.ts`, `importExport.ts`
- Integration tests for the import/export round-trip
- Snapshot tests for renderer output (catch accidental styling regressions)

**Rationale:** The core data model and rendering pipeline are stable enough to test. Without coverage, refactors and new renderers risk silent regressions.

### 1.2 Error Isolation
- Error boundaries around `SectionRenderer` and `EditorPanel`
- Graceful degradation: a broken renderer shows a fallback, not a blank page
- Dev-mode error logging with actionable messages

### 1.3 Runtime Schema Validation
- Zod schema mirroring `types/resume.ts`
- Validate on JSON import — reject or surface field-level errors before committing to store
- Validate on store hydration — catch localStorage shapes that migration missed

### 1.4 Import Pipeline (Text & Paste)
- Plain-text resume parser (heuristic section detection: heading patterns, bullet indentation)
- Paste-from-clipboard flow in the header import action
- Field-level confidence display: "We found this — does it look right?"

**Rationale:** Export is done. Import closes the round-trip and removes the "start from scratch" friction for existing resume holders.

---

## Phase 2 — Layout & Template System

**Goal:** Move beyond a single layout to support meaningfully different resume formats.

### 2.1 Overflow & Page Awareness
- Page-break overflow detection: highlight entries that will be split across pages
- Page count indicator in the preview toolbar
- Optional "fit to one page" density adjustment (reduce spacing/font scale)

**Rationale:** Users building a one-page resume have no visual feedback about overflow — this is a critical UX gap.

### 2.2 Template Architecture
- Define `ResumeTemplate` interface: section grid areas, column count, heading position
- Template switcher that swaps layout without touching resume data
- Two initial templates:
  - **Single column** (current layout)
  - **Sidebar column** (contact/skills left, experience/education right)

### 2.3 Extended Theme Controls
- Border radius scale (currently hardcoded per-component)
- Section heading alignment option (left vs. centered)
- Heading underline style options (rule, double-rule, dotted, none)

### 2.4 Editor UX Polish
- Undo/redo (Zustand middleware or immer patch history)
- Auto-save indicator driven by `updatedAt` timestamp
- Keyboard navigation between sections
- Focus mode (hide nav, expand form)

---

## Phase 3 — Intelligence & Collaboration

**Goal:** Use AI to reduce effort and add sharing capabilities.

### 3.1 AI-Assisted Writing
- Bullet point rewriter: select an experience bullet → suggest stronger phrasing
- Summary generator: draft a professional summary from experience entries
- Keyword analyzer: paste a job description → highlight matches and gaps in resume

**Engineering focus:** These are client-side calls to a Claude API. No backend required. Rate-limit awareness + streaming output.

### 3.2 Advanced Import
- PDF import via `pdfjs-dist`: extract text → run through resume parser
- LinkedIn HTML import: user copies profile HTML → parser extracts structured data
- Import preview diff: show what will change before committing

### 3.3 Shareable Links
- URL-encoded compressed JSON for read-only preview sharing (no backend)
- Copy-link button in preview toolbar
- Recipient loads link → sees full rendered resume, cannot edit

### 3.4 Named Snapshots
- Save named versions of the resume (e.g., "Frontend role", "General v2")
- Switch between snapshots without data loss
- Implemented as an array of `Resume` objects in a separate store slice

---

## Phase 4 — Platform & Ecosystem

**Goal:** Long-term extensibility if the project gains users or contributors.

### 4.1 Export Extensions
- DOCX export (`docx` npm package) — ATS-compatible Word format
- HTML export — self-contained file with inlined CSS
- ATS plain-text export — strips all formatting, preserves hierarchy

### 4.2 Cloud Sync
- Auth layer (OAuth with Google/GitHub)
- Remote resume storage (Supabase or equivalent)
- Multi-device sync + conflict resolution (last-write-wins initially)

### 4.3 Template Marketplace
- Community-contributed templates as JSON/CSS bundles
- Template preview gallery
- Safe sandboxed renderer for untrusted template CSS

### 4.4 Plugin Architecture
- Defined extension points: custom section types, custom renderers, custom exporters
- Plugin manifest format
- Dev tooling for local plugin development

**Rationale for Phase 4:** Only warranted if the project grows beyond personal use. Avoid premature abstraction — the registry pattern already enables most of this at small scale without a formal plugin system.
