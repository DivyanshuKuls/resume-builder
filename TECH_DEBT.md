# Technical Debt

Known architectural gaps, scalability concerns, and deferred decisions. Each item includes severity, impact, and a recommended future path.

---

## Store Architecture

### Monolithic `resumeStore.ts`
**Severity:** Medium  
**Impact:** The file grows with every new section type. Actions for personal info, skills, experience, sections, theme, and order management are all in one file. This creates merge surface area and makes it harder to reason about what touches what.  
**Recommended solution:** Split into domain slices (`personalSlice`, `sectionsSlice`, `skillsSlice`, `entriesSlice`, `themeSlice`) composed with Zustand's `create` + `immer` middleware. Each slice owns its state shape and actions.

### No Undo/Redo
**Severity:** Medium  
**Impact:** Any destructive action (delete entry, clear field, delete section) is permanent. Users have no recovery path besides re-entering data.  
**Recommended solution:** `immer` patch-based history middleware on the store. Limit to last N patches (e.g., 50). Expose `undo()` / `redo()` actions. Wire to `Ctrl+Z` / `Ctrl+Shift+Z`.

### `updatedAt` Timestamp Discipline
**Severity:** Low  
**Impact:** Every store mutation manually calls `touch()` to update `resume.updatedAt`. Easy to forget when adding new actions.  
**Recommended solution:** Immer middleware that automatically sets `updatedAt` on any state mutation, removing the manual `touch()` call requirement.

---

## Schema & Validation

### Incomplete Runtime Import Validation
**Severity:** Medium _(was High — basic structural validation now in place)_  
**Impact:** `parseResumeJSON` validates the `personalInfo` requirement and type-guards all top-level array fields, preventing the most common corruption paths. However, array _items_ are not validated (e.g., a malformed `Experience` object will pass through), and `persist` hydration is still unvalidated.  
**Recommended solution:** Add a Zod schema for the `Resume` type and apply it inside `parseResumeJSON` for full field-level safety. Also validate on `persist` hydration to catch stale localStorage shapes that migration didn't cover.

### Zustand Migration Coverage
**Severity:** Medium  
**Impact:** The migration function handles v3 (theme format change) but there's no systematic test coverage for migration paths. Future schema changes risk corrupting older localStorage data.  
**Recommended solution:** Version each migration step as a named function. Add unit tests for each version transition. Consider a migration dry-run that validates the result before overwriting.

### `SectionType` as String Literal Union
**Severity:** Low  
**Impact:** `SectionType = 'summary' | 'experience' | ...` is a fragile union. Adding a new type requires updating the union, both registries, store actions, `sectionContent.ts`, and `SECTION_TYPE_META` — easy to miss one.  
**Recommended solution:** Derive the union from `SECTION_TYPE_META` keys using `keyof typeof SECTION_TYPE_META`. This makes the registry the single source of truth for valid section types.

---

## Rendering

### PDF Pagination Edge Cases
**Severity:** Medium  
**Impact:** CSS `break-inside: avoid` on `.resume-entry` prevents mid-entry page breaks, but long entries (many bullets) can still overflow a page without breaking. Very long skill lists and custom sections have no break guidance.  
**Recommended solution:** Add `break-inside: avoid` to `.rt-skill-pill` groups and `.rt-custom-content` blocks. For entries that are inherently long (10+ bullets), consider optional "allow break" mode. Overflow detection (see roadmap Phase 2) would surface these cases to the user.

### No Renderer Virtualization
**Severity:** Low (current scale)  
**Impact:** All sections and entries are rendered synchronously. At current resume size (5–20 entries per section) this is imperceptible. With 50+ entries in a section, it could become noticeable.  
**Recommended solution:** React.lazy for unused section renderers (most resumes don't use all 8 types). For entry lists, `react-window` or `@tanstack/virtual` if profiling shows a real bottleneck.

### Semantic CSS Class Proliferation
**Severity:** Low  
**Impact:** `rt-*` classes are defined in `index.css` and referenced by all renderers. This is the intended architecture, but the class list grows with every new design token and could become hard to audit.  
**Recommended solution:** Document all `rt-*` classes in a style guide (or CSS comment block). Consider a CSS-in-JS approach for theme tokens if the variable count exceeds ~50.

---

## Editor

### `react-hook-form` Not Used in All Editors
**Severity:** Low  
**Impact:** `react-hook-form` is a dependency but adoption is inconsistent. Some editors use it; others use direct `onChange` handlers. This creates inconsistency in validation, dirty state, and field error display.  
**Recommended solution:** Standardize on `react-hook-form` across all section editors, or remove the dependency and commit to controlled inputs. Mixing both is the worst of both worlds.

### No Field-Level Validation UI
**Severity:** Low  
**Impact:** `validate.ts` exists but field errors are not consistently surfaced in the editor UI. Users get no inline feedback for invalid URLs, empty required fields, or date format issues.  
**Recommended solution:** Wire `validate.ts` rules to `react-hook-form` resolvers. Display inline error messages below fields. This is especially important for URL fields (contact links, project URLs).

---

## Performance

### Full Store Subscription in Preview
**Severity:** Low (current scale)  
**Impact:** `ResumePreview.tsx` subscribes to the full `resume` object. Any field change (even unrelated to preview) triggers a re-render of the entire preview tree.  
**Recommended solution:** Use `useShallow` selectors to subscribe only to the parts of state the preview actually renders. Already in use in hooks — needs consistent application in preview components.

### `computeThemeCSSVars` on Every Render
**Severity:** Low  
**Impact:** Theme CSS vars are recomputed on every render of the preview container. The computation involves object iteration and multiplication.  
**Recommended solution:** Memoize with `useMemo` keyed on `resume.theme`. Or pre-compute in the store and store the result alongside `ThemeSettings`.
