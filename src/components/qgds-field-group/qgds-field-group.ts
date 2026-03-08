import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-field-group.styles.scss?inline";

export type FieldGroupValue = string | string[];

export interface FieldGroupChangeDetail {
  name: string;
  value: FieldGroupValue;
}

export type QGDSFieldGroupProps = InstanceType<typeof QGDSFieldGroup>;

/**
 * A semantic wrapper for grouping related form inputs such as checkboxes and radios.
 * Listens to bubbled `change` events from slotted children and maintains its own value state.
 * Checkbox children produce an array value; radio children produce a single string value.
 *
 * By default renders a `<fieldset>` + `<legend>` for top-level groups.
 * Set `nested` when placing one group inside another: renders `<div role="group" aria-labelledby>`
 * instead, avoiding the screen-reader confusion that arises with nested `<fieldset>` elements.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 * @website https://www.designsystem.qld.gov.au/components/field-group
 * @tagname qgds-field-group
 *
 * @prop {string} label - The legend text labelling the group.
 * @prop {string} name  - Name identifying the group, forwarded to child inputs for form association.
 *
 * @slot - Accepts checkbox or radio input elements (or components wrapping them).
 *
 * @fires {CustomEvent<FieldGroupChangeDetail>} qgds-change - Fired when any child input changes.
 *   `detail.name` identifies the group; `detail.value` is a `string[]` for checkbox groups or a `string` for radio groups.
 *
 * @example
 * ```html
 * <!-- Checkbox group -->
 * <qgds-field-group label="Interests">
 *   <label><input type="checkbox" value="design"> Design</label>
 *   <label><input type="checkbox" value="code"> Code</label>
 * </qgds-field-group>
 *
 * <!-- Radio group -->
 * <qgds-field-group label="Priority">
 *   <label><input type="radio" name="priority" value="low"> Low</label>
 *   <label><input type="radio" name="priority" value="high"> High</label>
 * </qgds-field-group>
 * ```
 */
@customElement("qgds-field-group")
export class QGDSFieldGroup extends LitElement {
  @property({ type: String })
  label: string = "";

  @property({ type: String })
  name: string = "";

  @property({ type: Boolean })
  nested: boolean = false;

  @state() private _value: FieldGroupValue = [];

  /** Stable ID linking the label span to the div[role=group] when `nested` is set */
  private readonly _labelId = `qgds-fg-label-${Math.random().toString(36).slice(2)}`;

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // Listen on the host so composed change events from slotted custom elements
  // (e.g. qgds-checkbox) are reliably captured — the host is always in the
  // light DOM composed path, unlike the inner shadow DOM element.
  override connectedCallback(): void {
    super.connectedCallback?.();
    this.addEventListener("change", this._handleChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.removeEventListener("change", this._handleChange);
  }

  /**
   * Normalise a native HTMLInputElement or a custom element (e.g. qgds-checkbox)
   * that re-dispatches a composed change event, into a common shape.
   */
  private _resolveInput(
    el: EventTarget | null,
  ): { type: string; value: string; checked: boolean } | null {
    if (el instanceof HTMLInputElement) {
      return { type: el.type, value: el.value, checked: el.checked };
    }
    // Duck-type custom form elements that expose .type / .value / .checked
    if (
      el instanceof Element &&
      typeof (el as Element & { type?: unknown }).type === "string"
    ) {
      const custom = el as Element & {
        type: string;
        value: string;
        checked: boolean;
      };
      return {
        type: custom.type,
        value: custom.value,
        checked: custom.checked,
      };
    }
    return null;
  }

  private _handleChange = (e: Event): void => {
    // Stop the event at the host so it doesn't trigger a parent qgds-field-group
    e.stopPropagation();

    const input = this._resolveInput(e.composedPath()[0]);

    if (!input) return;

    if (input.type === "checkbox") {
      const current = Array.isArray(this._value) ? [...this._value] : [];
      this._value = input.checked
        ? [...current, input.value]
        : current.filter((v) => v !== input.value);
    } else if (input.type === "radio") {
      this._value = input.value;
    }

    this.dispatchEvent(
      new CustomEvent<FieldGroupChangeDetail>("qgds-change", {
        detail: { name: this.name, value: this._value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return html`
      <div role="group" aria-labelledby=${this._labelId}>
        <span id=${this._labelId} class="legend">${this.label}</span>
        <slot></slot>
      </div>
    `;
  }
}
