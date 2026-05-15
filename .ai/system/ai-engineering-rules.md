# AI Engineering Rules — Resume Builder Platform

Strict constraints for AI-assisted work on this codebase. These rules are non-negotiable. Violating them introduces architectural drift that is expensive to reverse.

---

## Architecture Constraints

### Preserve the Registry Pattern
- `SECTION_EDITORS` and `SECTION_RENDERERS` are the extension points for section types. Do not add `switch` statements, `if/else` chains, or inline conditional rendering as alternatives.
- Registering a new section type means adding entries to both registries and the necessary supporting files. Do not shortcut this.

### Never Hardcode Rendering Logic
- Section dispatch in `SectionEditor.tsx` and `SectionRenderer.tsx` must remain a registry lookup. Do not specialize these files for individual section types.
- Do not add per-section behavior to `ResumePreview.tsx` or `EditorPanel.tsx` outside the registry dispatch path.

### Never Couple Themes into Renderers
- Renderer components (`src/preview/renderers/*.tsx`) must use `rt-*` semantic CSS classes only.
- No Tailwind color utilities, no hardcoded hex values, no inline `style` for colors in renderers.
- Theme appearance is controlled entirely by CSS variables on `.resume-paper`. Renderers describe *structure*, not *appearance*.

### Preserve the Semantic Token System
- All design tokens are `--rt-*` CSS custom properties computed by `computeThemeCSSVars()` in `src/themes/tokens.ts`.
- Do not add ad-hoc CSS variables outside this system.
- Do not bypass the token pipeline by passing theme values as props to renderers.

### Preserve Print-Safe Rendering
- Do not add `@media print` overrides that conflict with existing page-break rules.
- Do not add JavaScript-based PDF generation (canvas, puppeteer) — the project uses native print intentionally.
- `break-inside: avoid` on `.resume-entry` is load-bearing. Do not remove it.

### Preserve DnD Stability
- `SortableEntryList.tsx` is the reusable nested sortable abstraction. Do not create parallel drag-and-drop implementations in individual section editors.
- Sensor configuration (8px pointer threshold, 150ms touch delay) exists to prevent drag activation on text interaction. Do not change it without testing.

### Preserve Responsive Behavior
- Both panels (`EditorPanel`, `PreviewPanel`) are always mounted. Visibility is CSS-toggled. Do not unmount either panel on mobile — this breaks form state preservation.
- The 46/54 desktop grid split is intentional. Do not change layout percentages without testing the preview/editor balance.

### Preserve Content Detection Centralization
- `src/utils/sectionContent.ts` → `hasSectionContent()` is the single source of truth for "does this section have content?" Do not replicate this logic inline in components.

---

## Process Constraints

### No Unnecessary Rewrites
- If existing code is architecturally correct, do not rewrite it for style preference or personal convention.
- Prefer incremental, targeted changes over sweeping refactors.
- If a refactor is needed (e.g., Zustand slice split), scope it precisely and do not combine it with feature work.

### No Speculative Abstractions
- Do not introduce abstractions for hypothetical future requirements. The registry pattern already handles extensibility — do not layer additional plugin systems on top of it prematurely.
- Three similar lines of code is acceptable. A premature abstraction is not.

### No Unnecessary Documentation Churn
- Do not update `docs/changelog.md` for implementation details, minor fixes, or refactors that do not represent a meaningful milestone.
- Do not add entries to `docs/backlog.md` for items that are already tracked.
- Do not update `TECH_DEBT.md` for issues that are resolved — remove or update the entry instead.

### Source Separation
- Production code belongs in `src/`. Do not add test utilities, fixtures, or mocks to `src/`.
- Test infrastructure belongs in `tests/`. Do not import from `tests/` in production code.

### Store Discipline
- New store actions must call `touch()` to update `resume.updatedAt`. Until immer middleware handles this automatically, every action is responsible for this.
- Do not access the Zustand store directly in components — use the hook layer (`useResume`, `useResumeActions`, `useResumeSelectors`).

---

## Testing Constraints

- Never mock the Zustand store — test it directly.
- Use `data-testid`, ARIA roles, or visible text for selectors — not CSS class names.
- Test data comes from builder functions in `tests/utils/resumeBuilders.ts` or fixtures in `tests/fixtures/`. Do not import `sampleResume` from `src/utils/defaults.ts` in tests.
- Do not assert on exact colors or pixel dimensions in any test — these break with theme changes.
- E2E tests must clear localStorage before each test via `page.evaluate(() => localStorage.clear())`.

---

## README Guidelines

README is the project entry point for contributors and users — not a technical reference. Keep it concise and navigational.

### README scope

**In scope:** project purpose, capabilities summary, setup commands, project structure overview, testing commands, links to detailed docs, AI-assisted engineering entry points.

**Out of scope:** renderer/store internals, theme pipeline implementation details, specific CSS class names, workflow/process instructions, changelog or backlog content.

### Where detail belongs

- Deep technical design → `docs/architecture.md`
- Workflow and process steps → `.ai/workflows/*`
- AI/tooling rules → `CLAUDE.md`, `AGENTS.md`
- Engineering priorities → `docs/backlog.md`
- Completed milestones → `docs/changelog.md`

### When to update README

**Should trigger an update:**
- A new major user-facing capability is added (new import format, new export target, new section category)
- Setup commands or environment requirements change
- Project structure changes significantly (new top-level directories, renamed entry points)
- A new AI workflow file or engineering governance doc is introduced

**Should NOT trigger an update:**
- Adding a new section editor/renderer (internal registry extension)
- Refactoring store actions, hooks, or the Zustand slice structure
- Updating a CSS variable name or `rt-*` class
- Bug fixes or performance improvements with no user-visible behavior change
- Internal documentation changes (backlog updates, tech debt entries, changelog additions)
- Changing theme presets or token computation internals
