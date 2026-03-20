import { html, LitElement, TemplateResult, PropertyValues, nothing } from "lit";
// import { classMap } from "lit/directives/class-map.js";
import { property } from "lit/decorators.js";
import { resetStyles, formStyles, utilitiesStyles } from "../../styles";
import { FormValidationState, FormIndicateIfOptions, FormVariantOptions } from "../../types/forms";

/**
 * Abstract base class for all QGDS form field components.
 * Provides common properties, validation handling, and rendering logic for form inputs.
 *
 * @abstract
 * @prop {String} id - Required unique identifier for the form field.
 * @prop {String} [name] - Required name attribute for form submission.
 * @prop {String} [label] - The form field's label text.
 * @prop {Boolean} [required=false] - Indicates whether the field is required.
 * @prop {FormIndicateIfOptions} [indicateIf] - Display indicator for "required", "optional", or "none".
 * @prop {FormVariantOptions} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {String} [hint] - Hint text to guide the user.
 * @prop {FormValidationState} [validationState] - The validation state, either "success" or "error".
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

  @property({ type: Boolean })
  required?: boolean = false;

  @property({ type: String, attribute: "indicate-if", useDefault: true })
  indicateIf?: FormIndicateIfOptions = "required";

  @property({ type: String })
  variant?: FormVariantOptions;

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

  // Enable form association
  static formAssociated = true;

  static styles = [resetStyles, formStyles, utilitiesStyles];

  protected _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // Public validation methods
  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    const isValid = this._internals.reportValidity();
    // Focus the select if validation fails for better accessibility
    if (!isValid) {
      this.focus();
    }
    return isValid;
  }

  // Lit lifecycle methods
  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id && !this.name) {
      console.warn(`id or name attribute is required`);
    }
  }

  // Custom internal methods
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

  /**
   * Abstract method to render the specific input element for the form field. Must be implemented by subclasses.
   * This method is called within the main render() method of the base class, which handles common rendering logic for labels, hints, and validation messages.
   */
  protected abstract renderInput(): TemplateResult;

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
