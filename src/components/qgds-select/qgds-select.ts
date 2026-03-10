import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-select.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-icon/qgds-icon";
import { QGDSSelectOption } from "./qgds-select-option.js";
import { QGDSSelectOptgroup } from "./qgds-select-optgroup.js";

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
 * Valid size options for the select element when multiple is enabled
 */
export type SelectSize = number | undefined;

/**
 * A native select dropdown component for form inputs.
 * Only accepts {@link QGDSSelectOption} and {@link QGDSSelectOptgroup} elements as children.
 *
 * @element qgds-select
 *
 * @attribute {string} label - The label text for the select element.
 * @attribute {boolean} disabled - Whether the select is disabled.
 * @attribute {boolean} required - Whether the select is required.
 * @attribute {boolean} filled - Whether to use the filled variant styling.
 * @attribute {boolean} valid - Whether the select is in a valid state.
 * @attribute {boolean} invalid - Whether the select is in an invalid state.
 * @attribute {string} hint - Hint text displayed below the label.
 * @attribute {string} optional-text - Optional text displayed next to the label.
 * @attribute {string} error-message - Error message displayed when invalid.
 * @attribute {string} success-message - Success message displayed when valid.
 * @attribute {string} placeholder - Placeholder text for the select element.
 * @attribute {string} name - Name attribute for form submission.
 * @attribute {string} value - Currently selected value (or comma-separated values for multiple).
 * @attribute {boolean} multiple - Whether multiple selections are allowed.
 * @attribute {number} size - Number of visible options when multiple is enabled.
 * @attribute {boolean} autofocus - Whether the select should automatically receive focus when the page loads.
 *
 * @example
 * ```html
 * <qgds-select label="Form label">
 *   <qgds-select-option value="1" label="Option 1"></qgds-select-option>
 *   <qgds-select-option value="2" label="Option 2"></qgds-select-option>
 * </qgds-select>
 * ```
 */

export type QGDSSelectProps = InstanceType<typeof QGDSSelect>;

@customElement("qgds-select")
export class QGDSSelect extends LitElement {
  // Enable form association
  static formAssociated = true;

  @property({ type: String }) label: string = "Select";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;
  @property({ type: Boolean, reflect: true }) required: boolean = false;
  @property({ type: Boolean, reflect: true }) filled: boolean = false;
  @property({ type: Boolean, reflect: true }) valid: boolean = false;
  @property({ type: Boolean, reflect: true }) invalid: boolean = false;
  @property({ type: String }) hint?: string = "";
  @property({ type: String }) optionalText?: string = "";
  @property({ type: String }) errorMessage?: string = "";
  @property({ type: String }) successMessage?: string = "";
  @property({ type: String }) placeholder: string = "Please select";
  @property({ type: String }) value: string = "";
  @property({ type: String }) name: string = "";
  @property({ type: String }) selectId: string = "";
  @property({ type: Boolean, reflect: true }) multiple: boolean = false;
  @property({ type: Number }) size?: SelectSize;
  @property({ type: Boolean, reflect: true }) autofocus: boolean = false;

  private _inputId = `qgds-select-${Math.random().toString(36).substr(2, 9)}`;
  private _internals: ElementInternals;
  private _mutationObserver?: MutationObserver;

  constructor() {
    super();
    // Attach ElementInternals for form participation
    this._internals = this.attachInternals();
  }

  connectedCallback(): void {
    super.connectedCallback?.();

    // Ensure form value is set when connected (important for form participation)
    this._internals.setFormValue(this.disabled ? null : this.value || "");

    // Set up mutation observer to watch for attribute changes on child options
    this._mutationObserver = new MutationObserver((mutations) => {
      // Check if any mutation affected our child option elements
      const hasOptionChanges = mutations.some((mutation) => {
        const target = mutation.target as Element;
        const tagName = target.tagName?.toLowerCase();
        return (
          (tagName === "qgds-select-option" ||
            tagName === "qgds-select-optgroup") &&
          mutation.type === "attributes"
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
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this._mutationObserver?.disconnect();
  }

  /**
   * Set initial form value when component first renders
   */
  firstUpdated(): void {
    // Set initial form value (don't validate yet - wait for user interaction or explicit validation)
    this._internals.setFormValue(this.value || "");

    // If required is set initially, set up validation state
    if (this.required) {
      this._validateAndUpdateState();
    }
  }

  get inputId(): string {
    return this.selectId || this._inputId;
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

  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  /**
   * Update form value and validity when value or multiple changes
   */
  updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("value") ||
      changedProperties.has("multiple") ||
      changedProperties.has("name")
    ) {
      // Set form value (for multiple, submit as comma-separated)
      // Don't set if disabled
      if (!this.disabled) {
        this._internals.setFormValue(this.value || "");
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
      if (this.disabled) {
        this._internals.setFormValue(null);
      } else {
        this._internals.setFormValue(this.value || "");
      }
    }

    // Sync select element with value property for multiple select
    if (changedProperties.has("value") && this.multiple) {
      this._syncMultipleSelectValue();
    }
  }

  render() {
    // Build aria-describedby with all relevant IDs
    const describedByIds = [
      this.hint ? `${this.inputId}-hint` : "",
      this.invalid && this.errorMessage ? `${this.inputId}-error` : "",
      this.valid && this.successMessage ? `${this.inputId}-success` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <label for="${this.inputId}">
        ${this.required
          ? html`<span class="required"
              >*<span class="sr-only"> (required)</span></span
            >`
          : ""}
        ${this.label}
        ${this.optionalText
          ? html`<span class="optional"
              >${this.optionalText}<span class="sr-only"
                >, not required</span
              ></span
            >`
          : ""}
      </label>
      ${this.hint
        ? html`<span id="${this.inputId}-hint" class="hint">${this.hint}</span>`
        : ""}
      ${this.invalid && this.errorMessage
        ? html`<span
            id="${this.inputId}-error"
            class="error-message"
            role="alert"
            aria-live="polite"
          >
            <qgds-icon
              icon-id="status-error"
              size="sm"
              aria-hidden="true"
            ></qgds-icon>
            ${this.errorMessage}
          </span>`
        : ""}
      ${this.valid && this.successMessage
        ? html`<span
            id="${this.inputId}-success"
            class="success-message"
            role="status"
            aria-live="polite"
          >
            <qgds-icon
              icon-id="status-success"
              size="sm"
              aria-hidden="true"
            ></qgds-icon>
            ${this.successMessage}
          </span>`
        : ""}
      <div class="select-wrapper">
        <select
          name="${this.name}"
          id="${this.inputId}"
          aria-describedby="${describedByIds || undefined}"
          aria-required="${this.required ? "true" : undefined}"
          .value=${this.value}
          @change=${this._handleChange}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?multiple=${this.multiple}
          ?autofocus=${this.autofocus}
          size="${this.multiple && this.size ? this.size : undefined}"
          aria-invalid="${this.invalid ? "true" : "false"}"
        >
          ${!this.multiple
            ? html`<option value="">${this.placeholder}</option>`
            : ""}
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
    const validationMessage = this._getValidationMessage();
    const selectElement = this.shadowRoot?.querySelector("select");

    // Always update ElementInternals validity
    if (!isValid && validationMessage) {
      this._internals.setValidity(
        { valueMissing: true },
        validationMessage,
        selectElement ?? undefined,
      );
    } else {
      // Clear validity when valid
      this._internals.setValidity({});
    }

    // Auto-update valid/invalid flags if no custom messages
    if (!this.errorMessage && !this.successMessage) {
      this.invalid = !isValid && this.value !== "";
      this.valid = isValid && this.value !== "";
    }
  }

  /**
   * Check validity with support for multiple select
   */
  private _checkValidity(): boolean {
    if (!this.required) {
      return true;
    }

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
          return this.errorMessage ?? "Please select at least one option";
        }
      } else {
        // For single, check if value is not empty
        if (!this.value) {
          return this.errorMessage ?? "Please select an option";
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
      const selectedOptions = Array.from(selectElement.selectedOptions).map(
        (opt) => opt.value,
      );
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
      }),
    );

    // Auto-validate after change
    this._validateAndUpdateState();
  };

  /**
   * Rebuild native options from slotted custom elements
   */
  private _rebuildNativeOptions(): void {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) return;

    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    // Get all assigned elements at once
    const assignedElements = slot.assignedElements({ flatten: true });

    // Validate that only qgds-select-option and qgds-select-optgroup elements are slotted
    const invalidElements = assignedElements.filter((el) => {
      const tagName = el.tagName.toLowerCase();
      return (
        tagName !== "qgds-select-option" && tagName !== "qgds-select-optgroup"
      );
    });

    if (invalidElements.length > 0) {
      console.warn(
        "qgds-select only accepts qgds-select-option and qgds-select-optgroup elements as children. " +
          "The following invalid elements will be ignored:",
        invalidElements,
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
      return (
        tagName === "qgds-select-option" || tagName === "qgds-select-optgroup"
      );
    });

    // Use DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();

    // Process only valid custom elements
    validElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();

      if (tagName === "qgds-select-optgroup") {
        // Custom optgroup element
        const customOptgroup = el as QGDSSelectOptgroup;
        const nativeOptgroup = customOptgroup.toNativeOptgroup();
        fragment.appendChild(nativeOptgroup);
      } else if (tagName === "qgds-select-option") {
        // Custom option element
        const customOption = el as QGDSSelectOption;
        const nativeOption = customOption.toNativeOption();
        fragment.appendChild(nativeOption);
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
        const optionExists = Array.from(select.options).some(
          (opt) => opt.value === this.value,
        );
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
    this.valid = false;
    this.invalid = false;
  }

  formStateRestoreCallback(state: string): void {
    this.value = state;
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   * Public validation methods
   */
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

  /**
   * Focus the select element
   * Public method for programmatic focus management
   */
  focus(): void {
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
