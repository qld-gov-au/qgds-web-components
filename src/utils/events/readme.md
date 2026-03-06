# QGDS Events Utility API

This module provides a central, consistent way to dispatch custom events from QGDS components.

- Controller: `src/utils/events/event-controller.ts`
- Semantic API wrapper: `src/utils/events/event-apis.ts`

## Quick Start

```ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { QgdsEvents } from "../../utils/events/event-controller";

@customElement("example-component")
export class ExampleComponent extends LitElement {
  events = new QgdsEvents(this);

  private onClick = (e: Event): void => {
    this.events.api.select("next", e, { component: this.localName });
  };

  render() {
    return html`<button @click=${this.onClick}>Next</button>`;
  }
}
```

## Default Behavior

When you call `emit()` (directly or via `events.api.*`):

- Event name is prefixed: `"select"` -> `"qgds-select"` by default.
- Event dispatch defaults:
  - `bubbles: true`
  - `composed: true`
  - `cancelable: false`
- `timestamp` is included by default.
- `window.dataLayer` push is disabled by default (`pushToDataLayer: false`).

## Creating The Controller

```ts
new QgdsEvents(host, {
  prefix?: string;           // default: "qgds"
  includeTimestamp?: boolean; // default: true
  pushToDataLayer?: boolean;  // default: false
});
```

## Low-Level API

Use `emit()` for custom event names not covered by semantic helpers.

```ts
events.emit(
  "filter",
  { value: "active", originalEvent: e },
  { bubbles: true, composed: true, cancelable: false },
);
```

Signature:

```ts
emit(
  name: string,
  detail?: Record<string, unknown>,
  options?: { bubbles?: boolean; composed?: boolean; cancelable?: boolean },
): boolean
```

## Semantic API Methods

Use `events.api.*` for consistent naming and payload shape.

### Selection and Value

```ts
select(id: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
change(value: unknown, originalEvent?: Event, detail?: Record<string, unknown>): boolean
input(value: unknown, originalEvent?: Event, detail?: Record<string, unknown>): boolean
toggle(open: boolean, originalEvent?: Event, detail?: Record<string, unknown>): boolean
```

### Open/Close and Expand/Collapse

```ts
open(detail?: Record<string, unknown>, originalEvent?: Event): boolean
close(detail?: Record<string, unknown>, originalEvent?: Event): boolean
expand(detail?: Record<string, unknown>, originalEvent?: Event): boolean
collapse(detail?: Record<string, unknown>, originalEvent?: Event): boolean
```

### Form Flow

```ts
submit(detail?: Record<string, unknown>, originalEvent?: Event): boolean
cancel(detail?: Record<string, unknown>, originalEvent?: Event): boolean
reset(detail?: Record<string, unknown>, originalEvent?: Event): boolean
```

### Navigation and Activation

```ts
navigate(target: string | number, originalEvent?: Event, detail?: Record<string, unknown>): boolean
activate(id: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
deactivate(id: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
```

### Focus and Dismiss

```ts
focus(detail?: Record<string, unknown>, originalEvent?: Event): boolean
blur(detail?: Record<string, unknown>, originalEvent?: Event): boolean
dismiss(reason?: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
```

### Lifecycle and Outcomes

```ts
load(detail?: Record<string, unknown>, originalEvent?: Event): boolean
ready(detail?: Record<string, unknown>, originalEvent?: Event): boolean
success(data?: unknown, originalEvent?: Event, detail?: Record<string, unknown>): boolean
failure(message: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
error(message: string, originalEvent?: Event, detail?: Record<string, unknown>): boolean
```

## Payload Shape

Semantic helpers add their primary field plus optional metadata:

- `select` -> `{ id, ...detail, originalEvent }`
- `change` / `input` -> `{ value, ...detail, originalEvent }`
- `toggle` -> `{ open, ...detail, originalEvent }`
- `navigate` -> `{ target, ...detail, originalEvent }`
- `failure` / `error` -> `{ message, ...detail, originalEvent }`

If `includeTimestamp` is enabled, payload also includes:

```ts
{
  timestamp: number;
}
```

## Analytics (`window.dataLayer`)

If `pushToDataLayer: true`, each emitted event also pushes:

```ts
window.dataLayer.push({
  event: "qgds-select",
  ...sanitisedDetail,
});
```

Sanitization behavior:

- `Event` values become their `type` string (for example `"click"`).
- `Element` values become their `localName`.
- `function` values are dropped.

## Recommended Usage Pattern

1. Create one `events` instance per component: `events = new QgdsEvents(this)`.
2. Use `events.api.*` in handlers for common interactions.
3. Add component metadata in `detail` (for example `component`, `id`, `name`).
4. Use `emit()` only for events not covered by semantic helpers.
