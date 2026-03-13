import { html, PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { QGDSFormField, ValidationState } from "./qgds-form-field";

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

  private _handleChange = (e: Event): void => {
    e.stopPropagation();

    const source = e.composedPath()[0];
    const input = this._resolveInput(source);
    if (!input) return;

    this._applyChange(input, source);

    this.dispatchEvent(
      new CustomEvent<FieldGroupChangeDetail>("qgds-change", {
        detail: { name: this.name, value: this._value },
        bubbles: true,
        composed: true,
      })
    );
  };

  protected abstract groupItemName: string;

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("validationState")) {
      this.querySelectorAll<Element & { status?: ValidationState }>(this.groupItemName).forEach((el) => {
        el.status = this.validationState;
      });
    }
  }

  renderInput() {
    return html`<slot></slot>`;
  }
}
