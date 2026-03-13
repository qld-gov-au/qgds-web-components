import { html, LitElement, TemplateResult, PropertyValues, nothing } from "lit";
import { property } from "lit/decorators.js";
import { resetStyles, formStyles, utilitiesStyles } from "../../styles";

export type ValidationState = "success" | "error";

/**
 * Abstract base class for all QGDS form field components.
 * Provides common properties, validation handling, and rendering logic for form inputs.
 *
 * @abstract
 * @prop {String} [id] - Required unique identifier for the form field.
 * @prop {String} [name] - Required name attribute for form submission.
 * @prop {String} [label] - The field's label text.
 * @prop {String | String[]} [value] - The current value of the field.
 * @prop {Boolean} [required=false] - Indicates whether the field is required.
 * @prop {IndicateIfOptions} [indicateIf] - Display indicator for "required", "optional", or "none".
 * @prop {VariantOptions} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {String} [hint] - Hint text to guide the user.
 * @prop {ValidationState} [validationState] - The validation state, either "success" or "error".
 * @prop {String} [validationMessage] - Validation feedback message displayed with the state.
 * @prop {Boolean} [disabled=false] - Disables the field when true.
 * @prop {Boolean} [readOnly=false] - Makes the field read-only when true.
 *
 * @slot details - Place any markup to be rendered within additional details.
 */
export abstract class QGDSFormField extends LitElement {
  @property({ type: String })
  id!: string;

  @property({ type: String })
  name?: string;

  @property({ type: String })
  label?: string;

  @property()
  value?: string | string[];

  @property({ type: Boolean })
  required?: boolean = false;

  @property({ type: String, attribute: "indicate-if", useDefault: true })
  indicateIf?: "required" | "optional" | "none";

  @property({ type: String })
  variant?: "filled" | "outlined";

  @property({ type: String })
  hint?: string;

  @property({ type: String, attribute: "validation-state" })
  validationState?: ValidationState;

  @property({ type: String, attribute: "validation-message" })
  validationMessage?: string;

  @property({ type: Boolean })
  disabled?: boolean = false;

  @property({ type: Boolean, attribute: "readonly" })
  readOnly?: boolean = false;

  static styles = [resetStyles, formStyles, utilitiesStyles];

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id && !this.name) {
      console.warn(`id or name attribute is required`);
    }
  }

  private renderRequiredIndicator() {
    return this.required && this.indicateIf === "required"
      ? html`<span class="qgds-form-label-required" aria-hidden="true">*</span><span class="sr-only">(Required)</span>`
      : nothing;
  }

  private renderOptionalIndicator() {
    return !this.required && this.indicateIf === "optional"
      ? html` <span class="qgds-form-label-optional">(optional)</span>`
      : nothing;
  }

  private get _iconId(): "status-error" | "status-success" | undefined {
    if (this.validationState === "error") return "status-error";
    if (this.validationState === "success") return "status-success";
    return undefined;
  }

  abstract renderInput(validationState?: "success" | "error"): TemplateResult;

  render() {
    if (!this.id) {
      console.warn(`id attribute is required`);
      return html`<p style="color: red;">Error: id attribute is required</p>`;
    }

    return html`${this.label
        ? html`<label class="qgds-form-label">
            ${this.renderRequiredIndicator()} ${this.label} ${this.renderOptionalIndicator()}
          </label>`
        : nothing}
      ${this.hint ? html`<p class="qgds-form-hint">${this.hint}</p>` : nothing}
      ${this.validationMessage
        ? html`
            <p class="qgds-form-feedback" role="alert">
              ${this._iconId ? html`<qgds-icon icon-id="${this._iconId}" size="sm"></qgds-icon>` : ""}
              ${this.validationMessage}
            </p>
          `
        : ""}
      <slot name="details"></slot>
      ${this.renderInput(this.validationState)}`;
  }
}
