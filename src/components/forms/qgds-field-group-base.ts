import { html, PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";
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

  /**
   * Hidden focusable element in shadow DOM used as the `validationAnchor` for
   * `ElementInternals.setValidity()`. The browser focuses this element when
   * form submission fails — the focus event is then forwarded to the first
   * real input in the slotted light DOM.
   */
  private _anchorRef: Ref<HTMLSpanElement> = createRef();

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
    return this._groupHasValue() ? "" : "This field is required.";
  }

  /**
   * Override to validate against `_value` without touching `nativeInput`.
   * Groups have no single native input element — validity is computed
   * directly from the aggregated selection state.
   *
   * Passes `_anchorRef` as the `validationAnchor` so the browser can focus
   * into the shadow DOM during form-submission validation, avoiding the
   * "An invalid form control … is not focusable" console error.
   */
  protected override _validateAndUpdateValidityState(): void {
    const hasValue = this._groupHasValue();
    const isValid = !this.required || hasValue;
    const message = this._getValidationMessage();

    if (!isValid) {
      this._internals.setValidity({ valueMissing: true }, message, this._anchorRef.value);
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
  override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
  }

  override formResetCallback(): void {
    this._value = this._initialValue();
    this.validationState = undefined;
    this.validationMessage = undefined;
  }

  private _handleChange = (e: Event): void => {
    e.stopPropagation();

    const source = e.composedPath()[0];
    const input = this._resolveInput(source);
    if (!input) return;

    this._applyChange(input, source);
    this._syncFormValue();
    this._validateAndUpdateValidityState();

    this.events.dispatch("change", { name: this.name ?? this.id, value: this._value }, e);
  };

  protected abstract groupItemName: string;

  protected update(changedProperties: PropertyValues): void {
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
    // The hidden span is the `validationAnchor` for ElementInternals.setValidity().
    // When the browser focuses it during form-submission validation, the focus
    // event is forwarded to the first real input in the slotted light DOM.
    return html`
      <span
        ${ref(this._anchorRef)}
        tabindex="-1"
        aria-hidden="true"
        style="position:absolute;left:8rem;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;"
      ></span>
      <slot></slot>
    `;
  }
}
