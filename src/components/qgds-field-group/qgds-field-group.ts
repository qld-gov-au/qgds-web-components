import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export type FieldGroupValue = string | string[];

export interface FieldGroupChangeDetail {
  name: string;
  value: FieldGroupValue;
}

/**
 * A headless wrapper for grouping related form inputs such as checkboxes and radios.
 * Responsible only for event aggregation — it has no visual output of its own.
 * Use `<qgds-form-field>` for label, hint, and validation message rendering.
 *
 * Listens to bubbled `change` events from slotted children and maintains a
 * single value state. Checkbox children produce a `string[]`; radio children
 * produce a single `string`.
 *
 * @website https://www.designsystem.qld.gov.au/components/field-group
 * @tagname qgds-field-group
 *
 * @prop {string} name - Name identifying the group, included in the `qgds-change` detail.
 *
 * @slot - Accepts checkbox or radio input elements (or components wrapping them).
 *
 * @fires {CustomEvent<FieldGroupChangeDetail>} qgds-change - Fired when any child input changes.
 *   `detail.name` identifies the group; `detail.value` is a `string[]` for checkbox groups
 *   or a `string` for radio groups.
 *
 * @example
 * ```html
 * <qgds-form-field label="Interests" hint="Select all that apply.">
 *   <qgds-field-group name="interests" @qgds-change=${handler}>
 *     <qgds-checkbox value="design" label="Design"></qgds-checkbox>
 *     <qgds-checkbox value="code"   label="Code"></qgds-checkbox>
 *   </qgds-field-group>
 * </qgds-form-field>
 * ```
 */
@customElement("qgds-field-group")
export class QGDSFieldGroup extends LitElement {
  @property({ type: String })
  name: string = "";

  @state() private _value: FieldGroupValue = [];

  override connectedCallback(): void {
    super.connectedCallback?.();
    this.addEventListener("change", this._handleChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.removeEventListener("change", this._handleChange);
  }

  /**
   * Normalise a native `HTMLInputElement` or a custom element (e.g. `qgds-checkbox`)
   * that re-dispatches a composed change event, into a common shape.
   */
  private _resolveInput(
    el: EventTarget | null,
  ): { type: string; value: string; checked: boolean } | null {
    if (el instanceof HTMLInputElement) {
      return { type: el.type, value: el.value, checked: el.checked };
    }
    if (
      el instanceof Element &&
      typeof (el as Element & { type?: unknown }).type === "string"
    ) {
      const custom = el as Element & {
        type: string;
        value: string;
        checked: boolean;
      };
      return { type: custom.type, value: custom.value, checked: custom.checked };
    }
    return null;
  }

  private _handleChange = (e: Event): void => {
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
    return html`<slot></slot>`;
  }
}
