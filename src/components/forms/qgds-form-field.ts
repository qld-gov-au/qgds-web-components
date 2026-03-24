import { html, LitElement, TemplateResult, PropertyValues, nothing } from "lit";
// import { classMap } from "lit/directives/class-map.js";
import { property } from "lit/decorators.js";
import { resetStyles, formStyles, utilitiesStyles } from "../../styles";
import { FormValidationState, FormIndicateIf } from "../../types/forms";

/**
 * Abstract base class for all QGDS form field components.
 * Provides common properties, validation handling, rendering logic, and
 * form association (via ElementInternals) for all form field inputs.
 *
 * @abstract
 * @prop {String} id - Required unique identifier for the form field.
 * @prop {String} [name] - Required name attribute for form submission.
 * @prop {String} [label] - The form field's label text.
 * @prop {String} [value] - The current value of the field.
 * @prop {Boolean} [required=false] - Indicates whether the field is required.
 * @prop {FormIndicateIf} [indicateIf] - Display indicator for "required", "optional", or "none".
 * @prop {String} [hint] - Hint text to guide the user.
 * @prop {FormValidationState} [validationState] - The validation state, either "success" or "error".
 * @prop {String} [validationMessage] - Validation feedback message displayed with the state.
 * @prop {Boolean} [disabled=false] - Disables the field when true.
 * @prop {Boolean} [readOnly=false] - Makes the field read-only when true.
 *
 * @slot details - Place any markup to be rendered within additional details.
 */
export abstract class QGDSFormField extends LitElement {
  // ── Static ─────────────────────────────────────────────────────────────────

  static formAssociated = true;

  static styles = [resetStyles, formStyles, utilitiesStyles];

  /** Set delegatesFocus: true for programatic focus, autofocus */
  static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  // ── Properties ─────────────────────────────────────────────────────────────

  @property({ type: String })
  id!: string;

  @property({ type: String })
  name?: string;

  @property({ type: String })
  label?: string;

  @property({ type: String })
  value?: string = "";

  @property({ type: Boolean })
  required?: boolean = false;

  @property({ type: String, attribute: "indicate-if", useDefault: true })
  indicateIf?: FormIndicateIf = "required";

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

  // ── Internals ──────────────────────────────────────────────────────────────

  protected _internals: ElementInternals;

  protected _validationMessage?: string;

  // Getters ensure these properties are always derived from current value of id.
  private get _labelId(): string {
    return `${this.id}-label`;
  }

  private get _hintId(): string {
    return `${this.id}-hint`;
  }

  private get _validationMessageId(): string {
    return `${this.id}-validation-message`;
  }

  protected get _ariaDescribedBy(): string {
    return [this.label && this._labelId, this.hint && this._hintId, this.validationMessage && this._validationMessageId]
      .filter(Boolean)
      .join(" ");
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id) {
      console.warn(`id or name attribute is required`);
    }

    if (changedProperties.has("value") || changedProperties.has("required")) {
      this._validateAndUpdateState();
    }

    if (changedProperties.has("value") || changedProperties.has("disabled")) {
      this._syncFormValue();
    }
  }

  // ── Form lifecycle callbacks ───────────────────────────────────────────────

  formResetCallback(): void {
    this.value = "";
    this.validationState = undefined;
    this.validationMessage = undefined;
    this._validationMessage = undefined;
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

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

  // ── Protected ──────────────────────────────────────────────────────────────

  /**
   * The value to sync into ElementInternals. Override in subclasses that
   * track their selection in a separate internal state (e.g. field groups).
   */
  protected get _currentValue(): string | string[] | undefined {
    return this.value;
  }

  /**
   * Sync the current value into ElementInternals so the field participates
   * in native form submission.
   */
  protected _syncFormValue(): void {
    if (this.disabled) {
      this._internals.setFormValue(null);
      return;
    }
    const raw = this._currentValue;
    if (Array.isArray(raw)) {
      const fd = new FormData();
      const key = this.name ?? this.id;
      raw.forEach((v) => fd.append(key, v));
      this._internals.setFormValue(fd);
    } else {
      this._internals.setFormValue(raw ?? "");
    }
  }

  /** Override in subclasses to customise the validation message. */
  protected _getValidationMessage(): string | undefined {
    if (!this.required) return "";
    if (!this.value) return "This field is required.";
    return "";
  }

  /**
   * Override in subclasses to define component-level validity without relying
   * on the native input element (e.g. when the native element's options don't
   * reflect the component value at validation time).
   */
  protected _computeIsValid(): boolean {
    const input = this._nativeInput;
    return input ? input.checkValidity() : true;
  }

  /** Auto-validation logic — syncs native input validity into ElementInternals. */
  protected _validateAndUpdateState(): void {
    const input = this._nativeInput;
    const isValid = this._computeIsValid();
    const hasValue = !!this.value;

    if (input && !isValid) {
      const v = input.validity;
      this._internals.setValidity(
        {
          valueMissing: v.valueMissing,
          typeMismatch: v.typeMismatch,
          patternMismatch: v.patternMismatch,
          tooLong: v.tooLong,
          tooShort: v.tooShort,
          rangeUnderflow: v.rangeUnderflow,
          rangeOverflow: v.rangeOverflow,
          stepMismatch: v.stepMismatch,
          badInput: v.badInput,
          customError: v.customError,
        },
        input.validationMessage,
        input
      );
    } else {
      this._internals.setValidity({});
    }

    this._validationMessage = this._getValidationMessage();
    this.validationState = isValid && hasValue ? "success" : "error";
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private get _nativeInput(): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
    return this.shadowRoot?.getElementById(this.id) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
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

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    if (!this.id) {
      console.warn(`id attribute is required`);
      return html`<p style="color: red;">Error: id attribute is required</p>`;
    }

    return html`${this.label
        ? html`<label class="qgds-form-label" for="${this.id}" id="${this._labelId}">
            ${this.renderRequiredIndicator()} ${this.label} ${this.renderOptionalIndicator()}
          </label>`
        : nothing}
      ${this.hint ? html`<p class="qgds-form-hint" id="${this._hintId}">${this.hint}</p>` : nothing}
      <slot name="details"></slot>
      ${this.validationMessage && this.validationState === "error"
        ? html`
            <p class="qgds-validation-message is-error" role="alert" id="${this._validationMessageId}">
              <qgds-icon icon-id="status-error" size="sm"></qgds-icon>
              ${this.validationMessage}
            </p>
          `
        : this.validationMessage && this.validationState === "success"
          ? html`<p class="qgds-validation-message is-success" role="status" id="${this._validationMessageId}">
              <qgds-icon icon-id="status-success" size="sm"></qgds-icon>
              ${this.validationMessage}
            </p>`
          : nothing}
      ${this.renderInput()}`;
  }
}
