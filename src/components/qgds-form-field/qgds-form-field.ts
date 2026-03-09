import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-form-field.styles.scss?inline";
import "../qgds-icon/qgds-icon";

export type QGDSFormFieldProps = InstanceType<typeof QGDSFormField>;

/**
 * A wrapper component that provides label, hint text, and validation message
 * for a form input. Place any form input (e.g. `<qgds-checkbox>`) in the
 * default slot.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=120360-101795
 * @tagname qgds-form-field
 *
 * @prop {string} label - Visible label text for the field.
 * @prop {string} hint - Optional hint/helper text displayed below the label.
 * @prop {string} message - Validation message shown when status is "error" or "success".
 * @prop {"error"|"success"|""} status - Visual state of the field.
 * @prop {boolean} required - When set, displays a red asterisk before the label.
 * @prop {boolean} optional - When set, displays "(optional)" after the label in lighter weight.
 *
 * @slot - The form input element (checkbox, radio, text input, etc.).
 *
 * @example
 * ```html
 * <qgds-form-field
 *   label="Your interests"
 *   hint="Select all that apply."
 *   status="error"
 *   message="Please select at least one option."
 *   required
 * >
 *   <qgds-checkbox value="design" label="Design"></qgds-checkbox>
 *   <qgds-checkbox value="code" label="Code"></qgds-checkbox>
 * </qgds-form-field>
 * ```
 */
@customElement("qgds-form-field")
export class QGDSFormField extends LitElement {
  @property({ type: String })
  label: string = "";

  @property({ type: String })
  hint: string = "";

  @property({ type: String })
  message: string = "";

  @property({ type: String, reflect: true })
  status: "error" | "success" | "" = "";

  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: Boolean, reflect: true })
  optional: boolean = false;

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  private get _iconId(): "status-error" | "status-success" | undefined {
    if (this.status === "error") return "status-error";
    if (this.status === "success") return "status-success";
    return undefined;
  }

  render() {
    const showHint = Boolean(this.hint);
    const showMessage = Boolean(this.message) && Boolean(this.status);

    return html`
      <div class="form-field">
        ${this.label
          ? html`
              <span class="label">
                ${this.required
                  ? html`<span class="required" aria-hidden="true">*</span>`
                  : ""}
                ${this.label}
                ${this.optional
                  ? html`<span class="optional"> (optional)</span>`
                  : ""}
              </span>
            `
          : ""}

        ${showHint
          ? html`<span class="hint">${this.hint}</span>`
          : ""}

        ${showMessage
          ? html`
              <span class="message" role="alert">
                ${this._iconId
                  ? html`<qgds-icon icon-id="${this._iconId}" size="sm"></qgds-icon>`
                  : ""}
                ${this.message}
              </span>
            `
          : ""}

        <div class="input-wrapper">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
