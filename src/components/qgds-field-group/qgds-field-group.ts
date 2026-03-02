import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import componentCSS from "./qgds-field-group.styles.scss?inline";

export type FieldGroupValue = string | string[];

export type QGDSFieldGroupProps = InstanceType<typeof QGDSFieldGroup>;

/**
 * A semantic fieldset wrapper for grouping related form inputs such as checkboxes and radios.
 * Listens to bubbled `change` events from slotted children and maintains its own value state.
 * Checkbox children produce an array value; radio children produce a single string value.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 * @website https://www.designsystem.qld.gov.au/components/field-group
 * @tagname qgds-field-group
 *
 * @attribute {string} label - The legend text labelling the group.
 *
 * @slot - Accepts checkbox or radio input elements (or components wrapping them).
 *
 * @fires {CustomEvent<{ value: FieldGroupValue }>} qgds-change - Fired when any child input changes.
 *   `detail.value` is a `string[]` for checkbox groups or a `string` for radio groups.
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

  @state() private _value: FieldGroupValue = [];

  static styles = css`
    ${unsafeCSS(componentCSS)}
  `;

  /** Read the actual input that fired the event, crossing shadow boundaries if needed */
  private _handleChange = (e: Event): void => {
    const input = e.composedPath()[0];

    if (!(input instanceof HTMLInputElement)) return;

    if (input.type === "checkbox") {
      const current = Array.isArray(this._value) ? [...this._value] : [];
      this._value = input.checked
        ? [...current, input.value]
        : current.filter((v) => v !== input.value);
    } else if (input.type === "radio") {
      this._value = input.value;
    }

    this.dispatchEvent(
      new CustomEvent<{ value: FieldGroupValue }>("qgds-change", {
        detail: { value: this._value },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return html`
      <fieldset @change=${this._handleChange}>
        <legend class="legend">${this.label}</legend>
        <slot></slot>
      </fieldset>
    `;
  }
}
