import { html, PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { QGDSFormField } from "./qgds-form-field";
import { FormValidationState } from "../../types/forms";

// ── Shared types ──────────────────────────────────────────────────────────────

export type FieldGroupValue = string | string[];

export interface FieldGroupChangeDetail {
  name: string;
  value: FieldGroupValue;
}

export interface ResolvedInput {
  type: string;
  value: string;
  checked: boolean;
}

// ── Base class ────────────────────────────────────────────────────────────────

/**
 * Headless base class for checkbox and radio group components.
 * Handles event wiring, input resolution, and `qgds-change` dispatch.
 * Subclasses implement `_initialValue()` and `_applyChange()` for their
 * specific value-aggregation logic.
 *
 * Not registered as a custom element — use `<qgds-checkbox-group>` or
 * `<qgds-radio-group>` instead.
 */
export abstract class QGDSFieldGroupBase extends QGDSFormField {
  // Calls the subclass override — prototype dispatch is dynamic even during
  // class-field initialisation, so the concrete implementation is always used.
  @state() protected _value: FieldGroupValue = this._initialValue();

  /** Return the starting value for this group type. */
  protected abstract _initialValue(): FieldGroupValue;

  /**
   * Apply a single input change to `this._value`.
   * @param input  Normalised input descriptor.
   * @param source The original event source (used by radio group to deselect siblings).
   */
  protected abstract _applyChange(input: ResolvedInput, source: EventTarget): void;

  override connectedCallback(): void {
    super.connectedCallback?.();
    this.addEventListener("change", this._handleChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.removeEventListener("change", this._handleChange);
  }

  /**
   * Normalise a native `HTMLInputElement` or a custom element
   * (e.g. `qgds-checkbox`, `qgds-radio`) into a common shape.
   */
  protected _resolveInput(el: EventTarget | null): ResolvedInput | null {
    if (el instanceof HTMLInputElement) {
      return { type: el.type, value: el.value, checked: el.checked };
    }
    if (el instanceof Element && typeof (el as Element & { type?: unknown }).type === "string") {
      const custom = el as Element & {
        type: string;
        value: string;
        checked: boolean;
      };
      return { type: custom.type, value: custom.value, checked: custom.checked };
    }
    return null;
  }

  /** Point the base sync logic at the internal selection state. */
  protected override get _currentValue(): FieldGroupValue {
    return this._value;
  }

  // ── Group-aware validity helpers ───────────────────────────────────────────

  private _groupHasValue(): boolean {
    const val = this._value;
    return Array.isArray(val) ? val.length > 0 : !!val;
  }

  /**
   * Override to derive the required message from the group's internal
   * `_value` instead of the inherited `this.value` (which is always "").
   */
  protected override _getValidationMessage(): string | undefined {
    if (!this.required) return "";
    return this._groupHasValue() ? "" : this.requiredErrorMessage;
  }

  /**
   * Override to validate against `_value` without touching `nativeInput`.
   * Groups have no single native input element — validity is computed
   * directly from the aggregated selection state.
   *
   * Uses the first slotted input as the `validationAnchor` so the browser
   * can focus it directly during form-submission validation.
   */
  protected override _validateAndUpdateValidityState(): void {
    const hasValue = this._groupHasValue();
    const isValid = !this.required || hasValue;
    const message = this._getValidationMessage();

    if (!isValid) {
      const anchorElement = this._getFirstSlottedInputElement();
      this._internals.setValidity({ valueMissing: true }, message, anchorElement);
    } else {
      this._internals.setValidity({});
    }

    this.validationMessage = message;
    this.validationState = isValid && hasValue ? "success" : "error";
  }

  /**
   * Watch `_value` changes (the internal `@state`) so validation and the
   * visual state update after every user interaction, not just on `value`
   * attribute changes (which never fire for groups).
   */
  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
  }

  override formResetCallback(): void {
    this._value = this._initialValue();
    this.validationState = undefined;
    this.validationMessage = undefined;
  }

  override focus(): void {
    this._focusFirstInput();
  }

  /**
   * Get the first slotted input element for use as validation anchor.
   * Returns the actual HTMLInputElement (either native or from custom element's shadow DOM).
   */
  private _getFirstSlottedInputElement(): HTMLElement | undefined {
    const firstInput = this.querySelector<HTMLInputElement | (Element & { focus(): void })>(this.groupItemName);

    if (!firstInput) return undefined;

    // If it's a native input, return it directly
    if (firstInput instanceof HTMLInputElement) {
      return firstInput;
    }

    // If it's a custom element with shadow DOM, try to get its internal input
    if (firstInput instanceof HTMLElement && firstInput.shadowRoot) {
      const shadowInput = firstInput.shadowRoot.querySelector("input");
      if (shadowInput) return shadowInput;
    }

    // Fallback to the custom element itself
    return firstInput instanceof HTMLElement ? firstInput : undefined;
  }

  private _focusFirstInput = (): void => {
    const firstInput = this._getFirstSlottedInputElement();
    firstInput?.focus();
  };

  private _handleChange = (e: Event): void => {
    e.stopPropagation();

    const source = e.composedPath()[0];
    const input = this._resolveInput(source);
    if (!input) return;

    this._applyChange(input, source);
    this._syncFormValue();
    if (this._internalValidate) {
      this._validateAndUpdateValidityState();
    }

    this.events.dispatch("change", { name: this.name ?? this.id, value: this._value }, e);
  };

  protected abstract groupItemName: string;

  protected requiredErrorMessage = "This field is required.";

  protected update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);
    this.querySelectorAll<Element & { validationState?: FormValidationState; name?: string; disabled?: boolean }>(
      this.groupItemName
    ).forEach((el) => {
      if (changedProperties.has("validationState")) {
        el.validationState = this.validationState;
      }
      if (changedProperties.has("name")) {
        el.name = this.name;
      }
      if (changedProperties.has("disabled")) {
        el.disabled = this.disabled;
      }
    });
  }

  renderInput() {
    // Directly slot the inputs - validation anchor points to the first slotted input
    return html`<slot></slot>`;
  }
}
