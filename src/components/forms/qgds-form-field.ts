import { html, LitElement, TemplateResult, PropertyValues, nothing, css } from "lit";
// import { classMap } from "lit/directives/class-map.js";
import { property } from "lit/decorators.js";
import { baseStyles, formStyles, utilitiesStyles } from "../../styles";
import { FormValidationState, FormIndicateIf } from "../../types/forms";
import { QgdsEvents } from "../../utils";

/**
 * Abstract base class for all QGDS form field components.
 * Provides common properties, validation handling, rendering logic, and
 * form association (via ElementInternals) for all form field inputs.
 *
 * @abstract
 * @prop {string} id - Required unique identifier for the form field.
 * @prop {string} [name] - Required name attribute for form submission.
 * @prop {string} [label] - The form field's label text.
 * @prop {string} [value] - The current value of the field.
 * @prop {boolean} [required=false] - Indicates whether the field is required.
 * @prop {FormIndicateIf} [indicateIf] - Display indicator for "required", "optional", or "none".
 * @prop {string} [hint] - Hint text to guide the user.
 * @prop {FormValidationState} [validationState] - The validation state, either "success" or "error".
 * @prop {string} [validationMessage] - Validation feedback message displayed with the state.
 * @prop {boolean} [disabled=false] - Disables the field when true.
 * @prop {boolean} [readOnly=false] - Makes the field read-only when true.
 * @prop {boolean} [nativeValidate=false] - opt in to HTML5 client side validation styles, which will render native browser validation popovers and messages rather than component defined and controlled via props. This is not recommended.

 *
 * @slot details - Place any markup to be rendered within additional details.
 *
 * @event qgds-change - Fired when the input's value changes
 */
export abstract class QGDSFormField extends LitElement {
  // ── Static ─────────────────────────────────────────────────────────────────

  static formAssociated = true;

  static styles = [
    baseStyles,
    formStyles,
    css`
      :host {
        display: block;
      }
    `,
    utilitiesStyles,
  ];

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
  private _value?: string | undefined = "";
  public get value(): string | undefined {
    return this._value;
  }
  public set value(value: string | undefined) {
    this._value = value;
  }

  @property({ type: Boolean })
  required?: boolean = false;

  @property({ type: String, attribute: "indicate-if", useDefault: true })
  indicateIf?: FormIndicateIf = "required";

  @property({ type: String })
  hint?: string;

  @property({ type: String, attribute: "validation-state", reflect: true })
  validationState?: FormValidationState;

  @property({ type: String, attribute: "validation-message", reflect: true })
  validationMessage?: string;

  @property({ type: Boolean })
  disabled?: boolean = false;

  @property({ type: Boolean, attribute: "readonly" })
  readOnly?: boolean = false;

  @property({ type: Boolean, attribute: "native-validate" })
  nativeValidate?: boolean = false;

  // ── Internals ──────────────────────────────────────────────────────────────

  protected _internals: ElementInternals;

  protected _validationMessage?: string;

  protected events: QgdsEvents;

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

  /**
   * The value to sync into ElementInternals. Override in subclasses that
   * track their selection in a separate internal state (e.g. field groups).
   */
  protected get _currentValue(): string | string[] | File | File[] | undefined {
    return this.value;
  }

  protected get _internalValidate(): boolean {
    if (this._internals.form?.noValidate) return false;
    return this.nativeValidate ?? false;
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.events = new QgdsEvents(this);
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has("id") && !this.id) {
      console.warn(`id or name attribute is required`);
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

  // ── Private API ──────────────────────────────────────────────────────────────

  protected handleChange = (e: Event): void => {
    this.value = (e.target as HTMLInputElement).value;
    this._syncFormValue();
    if (this._internalValidate) {
      this._validateAndUpdateValidityState();
    }

    this.events.dispatch("change", { name: this.name ?? this.id, value: this._currentValue }, e);
  };

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
      raw.forEach((v) => {
        if (v instanceof File) {
          fd.append(key, v);
        } else {
          fd.append(key, String(v));
        }
      });
      this._internals.setFormValue(fd);
    } else if (raw instanceof File) {
      this._internals.setFormValue(raw);
    } else {
      this._internals.setFormValue(raw ?? "");
    }
  }

  /** Override in subclasses to customise the validation message. */
  protected _getValidationMessage(): string | undefined {
    if (!this._internalValidate) {
      return this.validationMessage;
    }
    return this._nativeInput?.validationMessage ?? "";
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
  protected _validateAndUpdateValidityState(): void {
    const input = this._nativeInput;
    const isValid = this._computeIsValid();

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

    this.validationMessage = this._getValidationMessage();
    this.validationState = isValid ? "success" : "error";
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private get _nativeInput(): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
    return this.shadowRoot?.getElementById(this.id) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
  }

  // Custom internal render methods
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
      <div>${this.renderInput()}</div>`;
  }
}
