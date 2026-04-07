# Queensland Government Design System (QGDS) Web Components (Pre-Release)

## Pre-Release Notice

This project, **`qgds-web-components`**, is currently in a **pre-release build state**. It is not suitable for production deployment. Development is active, and **breaking changes should be expected frequently**. While we welcome early testing and contributions, exercise caution and do not integrate this into critical systems at this stage.

## Project Overview

This repository contains the foundational **Web Components** for the **Queensland Government Design System (QGDS)**. The objective is to establish a robust, reusable, and framework-agnostic component library that facilitates efficient and consistent development of web applications aligned with QGDS specifications.

## For npm consumers (Alpha)

This package is currently published as an **alpha** stream. It is provided for setup and early integration testing only.

- Breaking changes may occur between any alpha versions.
- Behaviour, API surface, and package structure may change without notice.
- Production use is not recommended at this stage.

### Install

Install the current alpha release from npm:

```bash
npm install @qld-gov-au/qgds-web-components@alpha
```

### Basic Usage

Import the component bundle and optional stylesheet in your app entrypoint:

```js
import "@qld-gov-au/qgds-web-components";
import "@qld-gov-au/qgds-web-components/styles.css";
```

Use components in your markup:

```html
<qgds-callout heading="Notice"> This is the QGDS Callout component. </qgds-callout>
```

### Storybook

An **alpha** release Storybook, containing example code and API documentation for QGDS Web Components, is available at: [https://qld-gov-au.github.io/qgds-web-components](https://qld-gov-au.github.io/qgds-web-components)

### Support Expectations

- Module format: ESM
- Browser support and SSR compatibility are still being validated during alpha
- Please report issues via the GitHub repository issue tracker, or through the QGDS Design System team channel qgdesignsystem@qld.gov.au.

## Getting Started (Development & Contribution)

To begin working with the current state of the components, clone the repository:

```bash
git clone https://github.com/qld-gov-au/qgds-web-components.git
cd qgds-web-components
```

### Custom Elements Manifest

A custom elements manifest is required to automate the API documentation.

To build a CEM, run:

```
npm run analyze
```

To watch for updates while also running live reload in storybook, run this in a separate terminal window:

```
npx cem analyze --watch
```

## CSS Namespacing

QGDS styles are namespaced to prevent collisions with host application styles or third-party libraries.

### Rules

- All CSS custom properties on `:root` use the `--qgds-` prefix (e.g. `--qgds-color-action-primary`, `--qgds-line-height-default`).
- All global CSS classes use the `qgds-` prefix (e.g. `qgds-form-control`, `qgds-palette-default`).
- Typography and element rules (`p`, `h1–h6`, `a`, etc.) are scoped to the `.qgds` container class and will not affect content outside it.

### Integration

Wrap your QGDS content in a container with the `qgds` class. Components themselves work anywhere — they use shadow DOM encapsulation — but the element-level typography styles only apply inside `.qgds`.

```html
<div class="qgds">
  <!-- Typography rules apply here -->
  <p>Styled by QGDS.</p>
  <a href="#">Styled link</a>

  <!-- Components work inside or outside .qgds -->
  <qgds-button label="Submit"></qgds-button>
</div>

<!-- Unaffected by QGDS typography rules -->
<p>Host application content, untouched.</p>
```

A palette class can be combined with the namespace class:

```html
<div class="qgds qgds-palette-default">
  ...
</div>
```

Storybook automatically applies both classes to every story via the global decorator in `.storybook/preview.ts`.

## VS Code Extensions

See `.vscode/extension.json` for recommended extensions.

### Some Sass

For the best experience follow [these instructions to turn off built in CSS language features](https://wkillerud.github.io/some-sass/user-guide/settings.html#going-all-in-on-some-sass) .
