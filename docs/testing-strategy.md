# Testing Strategy

## Philosophy

Tests in this project follow behaviour-driven principles:

- **Test what the code does, not how it does it.** Prefer assertions on rendered output and state mutations over internal implementation details.
- **Avoid brittle selectors.** Use `data-testid`, ARIA roles, and visible text rather than class names or DOM structure that changes with style updates.
- **Minimal mocking.** Only mock browser APIs that jsdom cannot provide (e.g., `URL.createObjectURL`, `FileReader`). Never mock the Zustand store itself — test it directly.
- **Stable fixtures.** All test data is defined in `tests/utils/resumeBuilders.ts` (builder functions) and `tests/fixtures/` (JSON files). Tests do not import `sampleResume` from `src/utils/defaults.ts`.
- **Forwards-compatible.** Tests must remain valid after future additions: multi-column layouts, template switching, import pipeline changes, advanced themes.

---

## Folder Structure

```
tests/
  e2e/                  Playwright end-to-end tests
    editor.spec.ts      Core editing, persistence, export/import, responsive layout
    dragdrop.spec.ts    Section and entry drag-and-drop reordering
  unit/
    utils/              Pure function unit tests
      validate.test.ts
      importExport.test.ts
      sectionContent.test.ts
    themes/
      tokens.test.ts    CSS variable computation
    store/
      resumeStore.test.ts  All Zustand store actions
  components/           React Testing Library component tests
    SectionRenderer.test.tsx
    SkillRenderer.test.tsx
    PreviewHeader.test.tsx
  fixtures/             Reusable JSON resume data
    simple-resume.json      Minimal resume (1 job, 1 degree, no extras)
    large-resume.json       Dense resume (4 jobs, 10+ skills, all sections)
    creative-resume.json    Design-focused, custom sections, color overrides
    stress-test-resume.json Edge cases: very long strings, Unicode, special chars
  mocks/
    zustand.ts          Store reset helper
  setup/
    vitest.setup.ts     Global setup: @testing-library/jest-dom, polyfills, localStorage clear
  utils/
    renderWithProviders.tsx  RTL render wrapper (add providers here if needed)
    resumeBuilders.ts        Factory functions for test data

playwright/             Playwright output (reports, traces) — gitignored
```

---

## Testing Types

### Unit tests (Vitest + jsdom)

Target: pure functions and the Zustand store.

| File | Covers |
|------|--------|
| `validate.test.ts` | `isValidEmail`, `isValidUrl`, `isValidDate` |
| `importExport.test.ts` | `parseResumeJSON` validation/merging, `exportResumeJSON` filename, `readJSONFile` |
| `sectionContent.test.ts` | `hasSectionContent` for all 8 section types |
| `tokens.test.ts` | `computeThemeCSSVars` — output shape, all presets, scale factors, color overrides, font family |
| `resumeStore.test.ts` | Every store action: CRUD for all entities, section system, theme, global actions |

### Component tests (Vitest + RTL)

Target: React components rendered in isolation with jsdom.

| File | Covers |
|------|--------|
| `SectionRenderer.test.tsx` | Empty section guard, heading, data attributes, alignment classes, custom sections, hidden section behavior |
| `SkillRenderer.test.tsx` | Individual mode (pills, empty state), grouped inline mode (labels, separator, empty groups), grouped block mode |
| `PreviewHeader.test.tsx` | Name/title rendering, empty guard, photo vs initials, photoAlignment left/right/none |

### E2E tests (Playwright)

Target: full browser interactions against the running dev server.

| File | Covers |
|------|--------|
| `editor.spec.ts` | Typing name/title/summary → preview update, section title editing, theme preset switching, localStorage persistence across reload, JSON export, responsive tab switcher, PDF button presence |
| `dragdrop.spec.ts` | Section manager visibility, drag handle presence, experience entry visibility |

---

## How to Run Tests

```bash
# Unit + component tests (one-shot)
npm test

# Unit + component tests in watch mode
npm run test:watch

# Coverage report (opens html/ in coverage/)
npm run test:coverage

# E2E tests (requires dev server on :5173)
npm run test:e2e

# E2E tests with interactive UI
npm run test:e2e:ui
```

The E2E `webServer` config in `playwright.config.ts` auto-starts `npm run dev` if the server is not already running.

---

## How to Add New Tests

### Adding a unit test

1. Create a file in `tests/unit/<domain>/my-thing.test.ts`.
2. Import the function under test directly from `@/...` (path alias is configured in `vitest.config.ts`).
3. Use builder functions from `tests/utils/resumeBuilders.ts` for any `Resume` data.

### Adding a component test

1. Create a file in `tests/components/MyComponent.test.tsx`.
2. Import the component from `@/...`.
3. Render with `render()` from `@testing-library/react` or `renderWithProviders` from `tests/utils/renderWithProviders.tsx`.
4. Use `screen`, `within`, `fireEvent`, `userEvent` for assertions.

### Adding an E2E test

1. Create or extend a file in `tests/e2e/*.spec.ts`.
2. Use `page.goto('/')` and then interact via ARIA roles, visible text, or `data-testid` attributes.
3. For stable selectors across layout changes, prefer `getByRole`, `getByLabel`, `getByText` over CSS class selectors.

---

## Fixture Strategy

Fixtures in `tests/fixtures/` are valid JSON resume exports that can be imported into the app via the Import JSON button, or loaded in tests via `parseResumeJSON(rawJson)`.

| Fixture | Purpose |
|---------|---------|
| `simple-resume.json` | Baseline — fast to render, only essential sections |
| `large-resume.json` | All sections populated with realistic professional data |
| `creative-resume.json` | Custom sections, block-style skill groups, photo on right, theme overrides |
| `stress-test-resume.json` | Edge cases: very long names/strings, Unicode, special HTML characters, 20 skills, tiny font/spacing scales |

Builder functions in `tests/utils/resumeBuilders.ts` are the preferred way to construct resume data in unit and component tests (they produce minimal but valid objects). Use JSON fixtures for integration-level or E2E tests where realistic data volume matters.

---

## E2E Approach

Playwright is configured to run against the Vite dev server (`localhost:5173`). The `webServer` block starts the server automatically if it is not already running.

Key conventions:
- Each test or describe block starts with `page.evaluate(() => localStorage.clear())` followed by a reload to ensure clean state.
- Prefer `getByRole` and `getByLabel` over CSS selectors.
- Avoid asserting exact colours or pixel measurements — these will break with theme changes.
- Drag-and-drop tests are intentionally lightweight; dnd-kit uses pointer events which are hard to reliably simulate in Playwright without real pointer event sequences. The tests verify the UI is present and non-crashing rather than the precise post-drag order.

---

## CI Integration

The `playwright.config.ts` reads `process.env.CI` to:
- Set `forbidOnly: true` (prevents accidentally committed `test.only`)
- Set `retries: 2` for flaky test resilience
- Set `workers: 1` to avoid port conflicts

Add to your CI pipeline:

```yaml
- run: npm test
- run: npx playwright install --with-deps chromium
- run: npm run test:e2e
```
