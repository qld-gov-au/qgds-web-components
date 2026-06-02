---
name: pr-review
description: >
  Peer-review a pull request against QGDS web component standards.
  Use when: reviewing a PR, auditing a new component, checking code quality,
  verifying Lit patterns, SCSS conventions, CEM output, Storybook stories,
  Vitest tests, accessibility, and TypeScript hygiene before merge.
argument-hint: "PR number, branch name, or file path to review"
---

# QGDS PR Review

## Procedure

1. Identify the files changed (component `.ts`, `.styles.scss`, `.stories.ts`, `.test.ts`).
2. **Run the build** to regenerate `custom-elements.json` and `src/index.ts` before reviewing:
   ```bash
   npm run build
   ```
   Then verify:
   - `src/index.ts` includes a barrel export for every new component.
   - `custom-elements.json` contains the new component(s) with their full public API.
   - No `privacy: "private"` members appear in `custom-elements.json`.
3. Work through each checklist section below that applies to the changed files.
4. Flag issues with a severity — **BLOCK** (must fix before merge), **WARN** (should fix), **SUGGEST** (nice to have).
5. Summarise findings at the end with a pass/fail verdict.

---

## 1 — Component TypeScript (`qgds-<name>.ts`)

### Naming & Registration

- [ ] Tag name follows `qgds-<name>` kebab-case convention.
- [ ] Class name uses **PascalCase with an all-caps `QGDS` prefix**. Every word after the prefix is capitalised:
  - ✅ `QGDSTable`, `QGDSButton`, `QGDSAccordionItem` — ❌ `QgdsTable`, `QGDSaccordionItem`, `Qgds_Table`
- [ ] `@customElement("qgds-<name>")` decorator present.
- [ ] **`HTMLElementTagNameMap` augmented** at the bottom of the file so TypeScript resolves the element type from `document.createElement` and `querySelector`:
  ```ts
  declare global {
    interface HTMLElementTagNameMap {
      "qgds-<name>": QGDS<Name>;
    }
  }
  ```
- [ ] Class is the **last** `export class` in the file so the barrel export generator picks up the right name.

### Class Member Order

Members must appear in this order. Reviewers should flag any deviation.

| #   | Section                | Examples                                                               |
| --- | ---------------------- | ---------------------------------------------------------------------- |
| 1   | `static` / constructor | `static formAssociated`, `static shadowRootOptions`                    |
| 2   | Styles                 | `static styles = [...]`                                                |
| 3   | Properties             | `@property(...)`, `@state()`                                           |
| 4   | Lit lifecycle methods  | `connectedCallback`, `disconnectedCallback`, `updated`, `firstUpdated` |
| 5   | Public methods         | Methods without `private` / `_` prefix                                 |
| 6   | Private methods        | `private _helper()`, arrow-function event handlers                     |
| 7   | `render()`             | Must be **last** method                                                |

- [ ] `@state()` fields are co-located with `@property()` fields (section 3), not scattered at the bottom.
- [ ] `render()` is the final method in the class.
- [ ] Commented-out lifecycle stubs from the skeleton template are removed before merge.

### Static Styles

- [ ] Styles use the established pattern — `baseStyles` first, then the scoped SCSS:
  ```ts
  static styles = [
    baseStyles,
    css`${unsafeCSS(componentCSS)}`,
  ];
  ```
- [ ] SCSS imported as `?inline`: `import componentCSS from "./qgds-<name>.styles.scss?inline";`

### Reserved HTML Attributes

Do not repurpose native HTML attributes for custom component logic.

| Native attribute  | Why to avoid              | Use instead         |
| ----------------- | ------------------------- | ------------------- |
| `type`            | Native button/input types | `variant`, `status` |
| `id`              | Native DOM ID             | `component-id`      |
| `hidden`          | Native visibility         | `is-hidden`         |
| `title`           | Native browser tooltip    | `heading`, `label`  |
| `class`           | CSS styling               | Pass-through only   |
| `href` / `target` | Links                     | Pass-through only   |
| `aria-*`          | Accessibility             | Use standard ARIA   |

### Recommended Attribute Names

Use these canonical names before inventing new ones.

| Recommended    | Avoid                       | Type   | Example                                               |
| -------------- | --------------------------- | ------ | ----------------------------------------------------- |
| `heading`      | title, headline, headerText | string | `heading="Callout title"`                             |
| `headingLevel` | headingTag, wrapperTag      | string | `headingLevel="h3"`                                   |
| `label`        | text, description           | string | `label="Submit"`                                      |
| `content`      | text, description           | string | Short text only — use slots for long HTML             |
| `palette`      | theme, color, style         | enum   | `palette="soft"` (default, soft, muted, strong, deep) |
| `variant`      | type, theme, level          | string | `variant="primary"`                                   |
| `size`         | scale, dimension            | enum   | `size="sm"`                                           |
| `placeholder`  | prefill                     | string | `placeholder="Search..."`                             |
| `items`        | data, listItems             | array  | `items="['A','B']"`                                   |

### Properties (`@property`)

- [ ] Every public attribute has an explicit `type` in the decorator.
- [ ] Uses canonical attribute names from the table above before introducing new names.
- [ ] Does not repurpose reserved HTML attributes (`type`, `id`, `hidden`, `title`, `class`).
- [ ] Boolean attributes follow the state prefix rules:
  - **Native states first** — use `disabled`, `checked`, `required`, `readonly` where a native HTML equivalent exists.
  - **`is-`** prefix for custom boolean status: `is-loading`, `is-active`, `is-expanded`, `is-open`.
  - **`has-`** prefix for conditional features/presence: `has-error`, `has-icon`, `has-tooltip`, `has-badge`.
  ```ts
  @property({ type: Boolean, attribute: "is-disabled", reflect: true })
  isDisabled = false;
  ```
- [ ] String/Number properties that drive host-level CSS selectors use `reflect: true`.
- [ ] Internal reactive state uses `@state()` (no attribute), not `@property`.
- [ ] No `@property` on internal-only fields — these should be plain class fields or `@state`.
- [ ] `?:` optional marker only used when `undefined` is a meaningful value distinct from a default.

### Slots

- [ ] Default (unnamed) slot used for main body content.
- [ ] Uses the standard slot names where applicable before inventing new ones:

  | Slot name   | Purpose                        | Example                              |
  | ----------- | ------------------------------ | ------------------------------------ |
  | _(default)_ | Main body content              | `<qgds-card><p>Body</p></qgds-card>` |
  | `icon`      | Decorative or functional icons | `<qgds-icon slot="icon" />`          |
  | `content`   | Complex descriptive text       | `<p slot="content">Detail</p>`       |

- [ ] Every named slot documented with `@slot` in JSDoc.

### Event Handlers

- [ ] Event handlers declared as **arrow function properties** (preserves `this` without `.bind()`):
  ```ts
  private _handleClick = (e: MouseEvent): void => { ... };
  ```
- [ ] Handlers attached in templates, not `addEventListener` in `connectedCallback`, unless a global/document listener is required.
- [ ] Global listeners (`window`, `document`) are removed in `disconnectedCallback`.

### Events Dispatched

- [ ] Custom events use the `QgdsEvents` utility or `new CustomEvent(...)` with `{ bubbles: true, composed: true }` so they cross shadow DOM boundaries.
- [ ] Event payloads are minimal — no DOM references, no PII, no full element trees.
- [ ] Every dispatched event is documented with `@fires` in JSDoc.

### Template Patterns

- [ ] `nothing` used (not `ifDefined`) when conditionally omitting a whole binding:
  ```ts
  style=${hasStyles ? styleMap(styles) : nothing}
  ```
- [ ] `ifDefined` used for attribute strings that should be omitted when `undefined`:
  ```ts
  aria-label=${ifDefined(this.ariaLabel ?? undefined)}
  ```
- [ ] `classMap` used for conditional class lists — no manual string concatenation.
- [ ] No raw `innerHTML` — use `unsafeHTML` (with justification comment) if unavoidable.

### Privacy & CEM Surface

- [ ] Internal methods prefixed `_` and declared `private`. These are stripped from the CEM by `post-process-cem.js`.
- [ ] No `private` members accidentally exposed as `@property`.
- [ ] For new components, consider `#` JS private fields to guarantee runtime encapsulation.

### JSDoc

Every component class must have a JSDoc block above the `@customElement` line containing:

- [ ] `@uikit` — Figma node URL
- [ ] `@website` — designsystem.qld.gov.au component URL
- [ ] `@prop` entries for every public `@property`
- [ ] `@slot` entries for every named slot (and the default slot if used)
- [ ] `@fires` for every dispatched event
- [ ] `@cssprop` for every supported CSS custom property
- [ ] At least one `@example` code block

---

## 2 — Styles (`qgds-<name>.styles.scss`)

### Design Tokens

- [ ] **No hardcoded colour values** — use `var(--qgds-color-*)` tokens with a sensible fallback:
  ```scss
  color: var(--qgds-color-text-default, #353535);
  ```
- [ ] **No hardcoded spacing magic numbers** — use `var(--qgds-spacing-*)` tokens or `rem`-based values.
- [ ] No hardcoded breakpoint pixel values — import and use the shared breakpoint tools via `@use`.

### Logical CSS Properties

- [ ] Uses **logical properties** throughout — no physical `width`/`height`/`top`/`left` etc.:
  - ✅ `inline-size`, `block-size`, `padding-inline`, `padding-block`, `inset-block-start`
  - ❌ `width`, `height`, `padding-left`, `margin-top`
- [ ] `stylelint` passes (`npm run lint:styles`) — no suppressions without a comment explaining why.

### SCSS Structure

- [ ] **Specificity kept shallow** — use SCSS `&` concatenation for block-elements, not nested descendant selectors:

  ```scss
  // ✅ Do
  .card {
    &-content { ... }
  }

  // ❌ Don't
  .card {
    .content { ... }  // nested selector
  }
  ```

- [ ] **Target classes, not element tags** — avoid bare element selectors inside component rules:

  ```scss
  // ✅ Do
  .button {
    &-icon { ... }
  }

  // ❌ Don't
  .button {
    svg { ... }  // element selector
  }
  ```

- [ ] CSS class modifiers follow the Bulma-style `is-` / `has-` convention (e.g. `is-small`, `is-active`, `has-hero-image`).

### Responsive Styles

- [ ] **Mobile-first** — base styles apply to mobile; desktop overrides use `min-width` (breakpoint-up):

  ```scss
  // ✅ Do
  .button {
    // mobile styles
    @media (min-width: qgds-breakpoint.$md) {
      // desktop styles
    }
  }

  // ❌ Don't — desktop-first with max-width
  .button {
    // desktop styles
    @media (max-width: qgds-breakpoint.$md) {
      // mobile styles
    }
  }
  ```

- [ ] Uses `qgds-breakpoint.$<size>` variables — no hardcoded pixel values in media queries.

### CSS Custom Property Conventions

When a component **exposes** CSS custom properties for consumer overrides, they must follow `namespace-category-state` pattern and use web-standard spelling (`color`, not `colour`).

| Property type | ✅ Do      | ❌ Don't                                                    |
| ------------- | ---------- | ----------------------------------------------------------- |
| Text colour   | `--fg`     | `--color`, `--colour`, `--color-text`, `--font-colour`      |
| Background    | `--bg`     | `--background`, `--background-color`, `--colour-background` |
| Border colour | `--border` | `--border-colour`, `--colour-border`                        |

| State                  | ✅ Do                                         | ❌ Don't                                                               |
| ---------------------- | --------------------------------------------- | ---------------------------------------------------------------------- |
| hover / active / focus | `--bg-hover`, `--bg-active`, `--border-focus` | `--hover-colour`, `--color-background-active`, `--focus-border-colour` |

Sub-element examples: `--label-fg`, `--label-fg-hover`, `--icon-color`, `--placeholder-fg`.

- [ ] All exposed `@cssprop` names follow the `namespace-category-state` pattern.
- [ ] Uses `color` spelling (not `colour`) in all custom property names.

### Scoping

- [ ] All rules scoped to the component (no leaking global styles unless intentional via `document.adoptedStyleSheets`).
- [ ] `document.adoptedStyleSheets` usage (for slotted light-DOM styling) is prefixed with the component tag name to avoid collisions.

---

## 3 — Stories (`qgds-<name>.stories.ts`)

### Meta

- [ ] `title` uses `"Components/<Name>"` (or `"Forms/<Name>"` for form components).
- [ ] `component` is the tag name string `"qgds-<name>"`.
- [ ] `tags: ["autodocs"]` present.
- [ ] `args` and `argTypes` defined for all public attributes.
- [ ] Attribute controls use kebab-case keys (`"is-disabled"`, `"has-border"`) matching the HTML attribute.
- [ ] Duplicate camelCase JS-property controls auto-generated by Storybook CEM integration are **disabled**:
  ```ts
  isDisabled: { table: { disable: true } },
  ```

### ArgTypes

- [ ] Every `argType` has a `description` and `table.defaultValue.summary`.
- [ ] `control` type is appropriate (`"select"`, `"boolean"`, `"text"` etc.).

### Stories

- [ ] At least one story per significant visual state or prop combination.
- [ ] Each story has a descriptive `name` and a JSDoc comment explaining the scenario.
- [ ] `parameters: { ...chromaticModes }` present on visual stories.
- [ ] `render` function uses `html` from Lit — not string concatenation.

---

## 4 — Tests (`qgds-<name>.test.ts`)

### Structure

- [ ] Uses `describe/it/expect` from `vitest`.
- [ ] `beforeEach` creates and appends element to `document.body`.
- [ ] `afterEach` removes element cleanly.
- [ ] `await element.updateComplete` called before DOM assertions.

### Coverage

- [ ] Default property values tested.
- [ ] Attribute → property reflection tested (set attribute, read JS property).
- [ ] Conditional rendering branches tested (e.g. renders `<figure>` vs `<div>`, renders link vs span).
- [ ] Boolean props tested both `true` and `false`.
- [ ] Slot content tested via `assignedNodes()` or `assignedElements()`.
- [ ] No tests that just assert `toBeTruthy()` on the element itself — test meaningful DOM state.

### Anti-patterns

- [ ] No `console.log` in tests.
- [ ] No `setTimeout` or manual delays — use `updateComplete`.
- [ ] No `@ts-ignore`.

---

## 5 — Accessibility

- [ ] Interactive elements reachable by keyboard (`tabindex`, `role`, keyboard event handlers).
- [ ] `aria-label` or `aria-labelledby` on elements without visible text.
- [ ] `aria-hidden="true"` on decorative icons.
- [ ] `role` set correctly when a non-semantic element is used for an interactive purpose.
- [ ] `<caption>` present on `<table>` elements.
- [ ] `<th scope="col|row">` on all table headers.
- [ ] Form inputs associated with labels via `id`/`for` or `aria-labelledby`.
- [ ] Lit a11y ESLint plugin passes (`npm run lint:ts`) — no suppressions without justification.

---

## 6 — General Code Quality

- [ ] No `console.log` in production code (`console.warn` is acceptable for developer guidance).
- [ ] No `@ts-ignore` or `as any` without an explanatory comment.
- [ ] No `!` non-null assertions on values that could legitimately be null at runtime.
- [ ] No hardcoded strings that should be props or tokens.
- [ ] ESLint passes: `npm run lint:ts --max-warnings 0`.
- [ ] TypeScript compiles without errors: `npx tsc --noEmit`.

---

## 7 — Barrel Export & CEM

- [ ] Component is **not** manually added to `src/index.ts` — it will be picked up automatically by `generate-component-exports.js`.
- [ ] Component class name starts with `QGDS` (case-insensitive match) so the generator includes it.
- [ ] After `npm run analyze`, `custom-elements.json` contains the component and its public API is correct.
- [ ] No `private` members visible in `custom-elements.json` (stripped by `post-process-cem.js`).

---

## 8 — File Structure

Each component must follow the standard layout:

```
src/components/qgds-<name>/
├── qgds-<name>.ts           # Component class
├── qgds-<name>.styles.scss  # Scoped styles
├── qgds-<name>.stories.ts   # Storybook stories
└── qgds-<name>.test.ts      # Vitest tests
```

- [ ] No extra files added without justification (helper types, sub-components etc. are fine but should be documented).
- [ ] Filename matches the folder name.

---

## Review Summary Template

```
## PR Review: <branch / PR title>

### Result: PASS / BLOCK / WARN

| Area | Status | Notes |
|------|--------|-------|
| Component TS | ✅ / ⚠️ / ❌ | |
| Attribute & slot naming | ✅ / ⚠️ / ❌ | |
| Styles | ✅ / ⚠️ / ❌ | |
| Stories | ✅ / ⚠️ / ❌ | |
| Tests | ✅ / ⚠️ / ❌ | |
| Accessibility | ✅ / ⚠️ / ❌ | |
| Code quality | ✅ / ⚠️ / ❌ | |
| CEM / barrel | ✅ / ⚠️ / ❌ | |

### BLOCKs
-

### WARNs
-

### SUGGESTIONs
-
```
