import { html, LitElement, TemplateResult, PropertyValues, nothing } from "lit";
// import { classMap } from "lit/directives/class-map.js";
import { property } from "lit/decorators.js";
import { resetStyles, formStyles, utilitiesStyles } from "../../styles";
import { FormValidationState, FormIndicateIfOptions } from "../../types/forms";

// export type ValidationState = "success" | "error";
// export type IndicateIfOptions = "required" | "optional" | "none";
// export type VariantOptions = "filled" | "outlined";

/**
 * Abstract base class for all QGDS form field components.
 * Provides common properties, validation handling, and rendering logic for form inputs.
 *
 * @abstract
 * @prop {String} id - Required unique identifier for the form field.
 * @prop {String} [name] - Required name attribute for form submission.
 * @prop {String} [label] - The form field's label text.
 * @prop {String | String[]} [value] - The current value of the field.
 * @prop {Boolean} [required=false] - Indicates whether the field is required.
 * @prop {FormIndicateIfOptions} [indicateIf] - Display indicator for "required", "optional", or "none".
 * @prop {VariantOptions} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {String} [hint] - Hint text to guide the user.
 * @prop {FormValidationState} [validationState] - The validation state, either "success" or "error".
 * @prop {String} [validationMessage] - Validation feedback message displayed with the state.
 * @prop {Boolean} [disabled=false] - Disables the field when true.
 * @prop {Boolean} [readOnly=false] - Makes the field read-only when true.
 * @prop {Boolean} [autofocus=false] - Automatically focuses the field when true.
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
  indicateIf?: FormIndicateIfOptions = "required";

  @property({ type: String })
  variant?: "filled" | "outlined";

  @property({ type: String })
  hint?: string;

  @property({ type: String, attribute: "validation-state" })
  validationState?: FormValidationState;

  @property({ type: String, attribute: "validation-message" })
  validationMessage?: string;

  @property({ type: Boolean })
  disabled?: boolean = false;

  @property({ type: Boolean, attribute: "readonly" })
  readOnly?: boolean = false;

  /** Set delegatesFocus: true for programatic focus, autofocus */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

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

  abstract renderInput(): TemplateResult;

  render() {
    if (!this.id) {
      console.warn(`id attribute is required`);
      return html`<p style="color: red;">Error: id attribute is required</p>`;
    }

    return html`${this.label
        ? html`<label class="qgds-form-label" for="${this.id}">
            ${this.renderRequiredIndicator()} ${this.label} ${this.renderOptionalIndicator()}
          </label>`
        : nothing}
      ${this.hint ? html`<p class="qgds-form-hint">${this.hint}</p>` : nothing}
      <slot name="details"></slot>
      ${this.validationMessage && this.validationState === "error"
        ? html`
            <p class="qgds-validation-message is-error" role="alert">
              <qgds-icon icon-id="status-error" size="sm"></qgds-icon>
              ${this.validationMessage}
            </p>
          `
        : this.validationMessage && this.validationState === "success"
          ? html`<p class="qgds-validation-message is-success" role="status">
              <qgds-icon icon-id="status-success" size="sm"></qgds-icon>
              ${this.validationMessage}
            </p>`
          : nothing}
      ${this.renderInput()}`;
  }
}
