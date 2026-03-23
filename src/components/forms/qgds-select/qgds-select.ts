import { html, TemplateResult, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { QGDSFormField } from "../qgds-form-field";
import componentCSS from "./qgds-select.styles.scss?inline";
import "../../qgds-icon/qgds-icon";
import { QGDSSelectOption } from "./qgds-select-option";
import { QGDSSelectOptgroup } from "./qgds-select-optgroup";
import { FormVariant, IFormControl } from "../../../types/forms";

/**
 * Event detail for change events
 */
export interface QGDSSelectChangeDetail {
  value: string | string[];
  multiple: boolean;
}

/**
 * Custom change event
 */
export type QGDSSelectChangeEvent = CustomEvent<QGDSSelectChangeDetail>;

/**
 * Event map for type-safe event listeners
 */
export interface QGDSSelectEventMap {
  change: QGDSSelectChangeEvent;
}

/**
 * A native select dropdown component for form inputs.
 * Only accepts {@link QGDSSelectOption} and {@link QGDSSelectOptgroup} elements as children.
 *
 * @element qgds-select
 *
 * @prop {FormVariant} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {String} [placeholder] - Placeholder text shown as the first (unselectable) option.
 * @prop {Boolean} [multiple] - Whether multiple selections are allowed.
 * @prop {Number} [size] - Number of visible options when multiple is enabled.
 * @prop {Boolean} [autofocus] - Whether the select should automatically receive focus.
 *
 * @slot - Accepts {@link QGDSSelectOption} and {@link QGDSSelectOptgroup} elements as options.
 *
 * @example
 * ```html
 * <qgds-select id="my-select" label="Form label">
 *   <qgds-select-option value="1" label="Option 1"></qgds-select-option>
 *   <qgds-select-option value="2" label="Option 2"></qgds-select-option>
 * </qgds-select>
 * ```
 */
@customElement("qgds-select")
export class QGDSSelect extends QGDSFormField implements IFormControl {
  // Re-declare value as a plain string (base type is string | string[] | undefined)
  @property({ type: String }) variant?: FormVariant;
  @property({ type: String }) value: string = "";
  @property({ type: String }) placeholder: string = "Please select";
  @property({ type: Boolean, reflect: true }) multiple: boolean = false;
  @property({ type: Number }) size?: number;
  // @property({ type: Boolean, reflect: true }) autofocus: boolean = false;

  private _mutationObserver?: MutationObserver;

  static styles = [
    ...super.styles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  connectedCallback(): void {
    super.connectedCallback?.();

    // Set up mutation observer to watch for attribute changes on child options
    this._mutationObserver = new MutationObserver((mutations) => {
      // Check if any mutation affected our child option elements
      const hasOptionChanges = mutations.some((mutation) => {
        const target = mutation.target as Element;
        const tagName = target.tagName?.toLowerCase();
        return (
          (tagName === "qgds-select-option" || tagName === "qgds-select-optgroup") && mutation.type === "attributes"
        );
      });

      if (hasOptionChanges) {
        // Rebuild native options
        this._rebuildNativeOptions();
      }
    });

    // Observe attribute changes on all descendants
    this._mutationObserver.observe(this, {
      attributes: true,
      subtree: true,
      attributeFilter: ["disabled", "selected", "label", "value"],
    });

    // Set form value when element is connected to DOM (important for form participation)
    // This ensures the value is set when the element is appended to a form
    this._internals.setFormValue(this.disabled ? null : (this.value ?? ""));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this._mutationObserver?.disconnect();
  }

  /**
   * Set initial form value when component first renders
   */
  firstUpdated(): void {
    // Guarantee id is always set so the base's render guard never triggers
    if (!this.id) this.id = `qgds-select-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get the current value as an array
   * Useful for multiple select handling
   */
  get valueAsArray(): string[] {
    if (!this.value) return [];
    return this.multiple ? this.value.split(",") : [this.value];
  }

  /**
   * Set value from an array
   * Useful for multiple select handling
   */
  set valueAsArray(values: string[]) {
    this.value = values.join(",");
  }

  /**
   * Update form value and validity when value or multiple changes
   */
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("value") || changedProperties.has("multiple") || changedProperties.has("name")) {
      // Set form value (for multiple, submit as comma-separated)
      // Don't set if disabled
      if (!this.disabled) {
        this._internals.setFormValue(this.value ?? "");
      }

      // Validate on value change
      if (changedProperties.has("value")) {
        this._validateAndUpdateState();
      }
    }

    if (changedProperties.has("required")) {
      // Re-validate when required changes
      this._validateAndUpdateState();
    }

    if (changedProperties.has("disabled")) {
      // Update disabled state
      this._internals.setFormValue(this.disabled ? null : (this.value ?? ""));
    }

    // Sync select element with value property for multiple select
    if (changedProperties.has("value") && this.multiple) {
      this._syncMultipleSelectValue();
    }
  }

  protected renderInput(): TemplateResult {
    return html`
      <div class="select-wrapper">
        <select
          name="${this.name}"
          id="${this.id}"
          class=${classMap({
            "qgds-form-control is-full-width": true,
            "is-filled": this.variant === "filled",
            "is-valid": this.validationState === "success",
            "is-invalid": this.validationState === "error",
          })}
          .value=${this.value}
          @change=${this._handleChange}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?multiple=${this.multiple}
          ?autofocus=${this.autofocus}
          size="${this.multiple && this.size ? this.size : undefined}"
          aria-describedby="${ifDefined(this._ariaDescribedBy)}"
          aria-invalid="${this.validationState === "error" ? "true" : "false"}"
        >
          ${!this.multiple ? html`<option value="">${this.placeholder}</option>` : ""}
        </select>
      </div>
      <slot @slotchange=${this._onSlotChange}></slot>
    `;
  }

  /**
   * Auto-validation logic
   */
  private _validateAndUpdateState(): void {
    const isValid = this._checkValidity();
    const message = this._getValidationMessage();
    const selectElement = this.shadowRoot?.querySelector("select");
    const hasValue = this.value !== "";

    // Always update ElementInternals validity
    if (!isValid && message) {
      this._internals.setValidity({ valueMissing: true }, message, selectElement ?? undefined);
    } else {
      // Clear validity when valid
      this._internals.setValidity({});
    }

    // Auto-update valid/invalid flags if no custom messages
    if (!this.validationMessage) {
      this.validationState = isValid && hasValue ? "success" : "error";
    }
  }

  /**
   * Check validity with support for multiple select
   */
  private _checkValidity(): boolean {
    if (!this.required) return true;
    if (this.multiple) {
      // For multiple, check if any values are selected and not just empty string
      const values = this.valueAsArray;
      return values.length > 0 && values.some((v) => v !== "");
    }
    // For single, check if value is not empty
    return this.value !== "" && this.value !== null && this.value !== undefined;
  }

  /**
   * Get validation message
   */
  private _getValidationMessage(): string {
    if (this.required) {
      if (this.multiple) {
        // For multiple, check if any values are selected
        if (this.valueAsArray.length === 0 || this.valueAsArray[0] === "") {
          return this.validationMessage ?? "Please select at least one option";
        }
      } else {
        // For single, check if value is not empty
        if (!this.value) {
          return this.validationMessage ?? "Please select an option";
        }
      }
    }
    return "";
  }

  /**
   * Handle change events with auto-validation and multiple select support
   */
  private _handleChange = (e: Event): void => {
    const selectElement = e.target as HTMLSelectElement;

    if (this.multiple) {
      // Get all selected options for multiple select
      const selectedOptions = Array.from(selectElement.selectedOptions).map((opt) => opt.value);
      this.value = selectedOptions.join(",");
    } else {
      // Single select
      this.value = selectElement.value;
    }

    // Dispatch typed custom event with proper value type
    this.dispatchEvent(
      new CustomEvent<QGDSSelectChangeDetail>("change", {
        detail: {
          value: this.multiple ? this.valueAsArray : this.value,
          multiple: this.multiple,
        },
        bubbles: true,
        composed: true,
      })
    );

    // Auto-validate after change
    this._validateAndUpdateState();
  };

  /**
   * Rebuild native options from slotted custom elements
   */
  private _rebuildNativeOptions(): void {
    // Select the unnamed slot — the base class renders <slot name="details"> first,
    // so querySelector("slot") would find that one instead of the options slot.
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    if (!slot) return;

    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Get all assigned elements at once
    const assignedElements = slot.assignedElements({ flatten: true });

    // Validate that only qgds-select-option and qgds-select-optgroup elements are slotted
    const invalidElements = assignedElements.filter((el) => {
      const tagName = el.tagName.toLowerCase();
      return tagName !== "qgds-select-option" && tagName !== "qgds-select-optgroup";
    });

    if (invalidElements.length > 0) {
      console.warn(
        "qgds-select only accepts qgds-select-option and qgds-select-optgroup elements as children. " +
          "The following invalid elements will be ignored:",
        invalidElements
      );
    }

    // Determine the starting index (skip placeholder for single select)
    const startIndex = !this.multiple ? 1 : 0;

    // Remove all options except placeholder (if single select)
    // Remove from end to avoid index shifting issues
    for (let i = select.options.length - 1; i >= startIndex; i--) {
      select.remove(i);
    }

    // Filter to only process valid custom elements
    const validElements = assignedElements.filter((el) => {
      const tagName = el.tagName.toLowerCase();
      return tagName === "qgds-select-option" || tagName === "qgds-select-optgroup";
    });

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();

    // Process only valid custom elements
    validElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      if (tagName === "qgds-select-optgroup") {
        fragment.appendChild((el as QGDSSelectOptgroup).toNativeOptgroup());
      } else if (tagName === "qgds-select-option") {
        fragment.appendChild((el as QGDSSelectOption).toNativeOption());
      }
    });

    // Append all at once for better performance
    select.appendChild(fragment);

    // Restore value if it exists in new options
    if (this.value) {
      if (this.multiple) {
        // For multiple select, check each value
        this._syncMultipleSelectValue();
      } else {
        // For single select
        const optionExists = Array.from(select.options).some((opt) => opt.value === this.value);
        if (optionExists) {
          select.value = this.value;
        } else {
          // Value no longer exists in options, reset
          this.value = "";
        }
      }
    }
  }

  /**
   * Optimized option cloning with DocumentFragment (avoiding innerHTML manipulation)
   * Only accepts qgds-select-option and qgds-select-optgroup custom elements
   */
  private _onSlotChange = (_e: Event) => {
    this._rebuildNativeOptions();
  };

  /**
   * Sync multiple select element with comma-separated value
   */
  private _syncMultipleSelectValue(): void {
    const select = this.shadowRoot?.querySelector("select");
    if (!select || !this.multiple) return;

    const values = this.valueAsArray;
    Array.from(select.options).forEach((option) => {
      option.selected = values.includes(option.value);
    });
  }

  /**
   * Form lifecycle callbacks
   */
  formResetCallback(): void {
    this.value = "";
    this.validationState = undefined;
    this.validationMessage = undefined;
  }

  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   * Focus the select element
   * Public method for programmatic focus management
   */
  override focus(): void {
    const select = this.shadowRoot?.querySelector("select");
    select?.focus();
  }

  /**
   * Get all selected values as an array
   * Convenience method for multiple select
   */
  getSelectedValues(): string[] {
    return this.valueAsArray;
  }

  /**
   * Set selected values from an array
   * Convenience method for multiple select
   */
  setSelectedValues(values: string[]): void {
    this.valueAsArray = values;
  }
}

// Augment global types for type-safe event handling
declare global {
  interface HTMLElementTagNameMap {
    "qgds-select": QGDSSelect;
  }
}

// Re-export related components that are tightly coupled with QGDSSelect
export { QGDSSelectOption } from "./qgds-select-option.js";
export { QGDSSelectOptgroup } from "./qgds-select-optgroup.js";
