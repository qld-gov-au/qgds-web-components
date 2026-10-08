import { html, PropertyValues, TemplateResult, unsafeCSS } from "lit";
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
 * A native select dropdown component for form inputs.
 * Only accepts {@link QGDSSelectOption} and {@link QGDSSelectOptgroup} elements as children.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321345
 * @website https://www.designsystem.qld.gov.au/components/select
 *
 * @prop {FormVariant} [variant] - The visual style of the input, either "filled" or "outlined".
 * @prop {String} [placeholder] - Placeholder text shown as the first (unselectable) option.
 * @prop {Boolean} [multiple] - Whether multiple selections are allowed.
 * @prop {Number} [size] - Number of visible options when multiple is enabled.
 * @prop {Array} [selectedValues] - An array of currently selected values, useful for multiple variant
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
  @property({ type: String }) variant?: FormVariant;
  @property({ type: String }) placeholder: string = "Select";
  @property({ type: Boolean }) multiple: boolean = false;
  @property({ type: Number }) size?: number;
  @property({ type: Array, attribute: false }) selectedValues: string[] = [];
  // @property({ type: String })
  override get value(): string {
    return this.selectedValues[0] || "";
  }
  override set value(value: string) {
    this.selectedValues = [value];
  }

  private _mutationObserver?: MutationObserver;

  static styles = [...super.styles, unsafeCSS(componentCSS)];

  // override get value to return the first item in selectedValues
  // set value also updates selectedValues

  // Public methods

  override connectedCallback(): void {
    super.connectedCallback();

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
      characterData: true,
      subtree: true,
      attributeFilter: ["disabled", "selected", "value", "label"],
    });

    // Set form value when element is connected to DOM (important for form participation)
    // This ensures the value is set when the element is appended to a form
    this._internals.setFormValue(this.disabled ? null : (this.value ?? ""));
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mutationObserver?.disconnect();
  }

  firstUpdated(): void {
    // Guarantee id is always set so the base's render guard never triggers
    if (!this.id) this.id = `qgds-select-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update form value and validity whens value or multiple change
   */
  updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties); // handles _syncFormValue for value/disabled

    // Sync select element with value property for multiple select
    if (changedProperties.has("selectedValues")) {
      this._syncSelectedValueToOptions();
    }
  }

  /**
   * Component-level validity — checks this.value directly rather than the
   * native <select>, whose options may not be populated at validation time.
   */
  protected override _computeIsValid(): boolean {
    if (!this.required) return true;
    if (this.multiple) {
      const values = this.selectedValues;
      return values.length > 0 && values.some((v) => v !== "");
    }
    return !!this.value;
  }

  /** @inheritdoc */
  override checkValidity(): boolean {
    return this._computeIsValid();
  }

  /** Get value array or string depending on multiple select */
  protected override get _currentValue(): string | string[] | undefined {
    return this.multiple ? this.selectedValues : this.value;
  }

  /**
   * Updates the component value to the event's value
   * syncs the value into element internals
   * validates and updates validitystate
   * dispatches custom change event
   * @param {Event} e
   */
  protected override handleChange = (e: Event): void => {
    const selectElement = e.target as HTMLSelectElement;
    this.selectedValues = Array.from(selectElement.selectedOptions).map((opt) => opt.value);
    this._syncFormValue();
    if (this._internalValidate) {
      this._validateAndUpdateValidityState();
    }

    this.events.dispatch("change", { name: this.name ?? this.id, value: this._currentValue }, e);
  };

  /**
   * Rebuild native options from slotted custom elements
   */
  private _rebuildNativeOptions(): void {
    // console.log("rebuild native options");
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
        this._syncSelectedValueToOptions();
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
   * Sync selectedOptions with the DOM options elements
   */
  private _syncSelectedValueToOptions(): void {
    const select = this.shadowRoot?.querySelector("select");
    if (!select) return;

    const values = this.selectedValues;
    if (this.multiple) {
      Array.from(select.options).forEach((option) => {
        option.selected = values.includes(option.value);
      });
    } else {
      const option = Array.from(select.options).find((opt) => opt.value === this.value);
      if (option) option.selected = true;
    }
  }

  /**
   * Form lifecycle callbacks
   */
  override formResetCallback(): void {
    this.value = ""; // select resets to "" not undefined
    this.validationState = undefined;
    this.validationMessage = undefined;
  }

  override reportValidity(): boolean {
    const isValid = super.reportValidity();
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
  override focus(): void {
    const select = this.shadowRoot?.querySelector("select");
    select?.focus();
  }

  protected renderInput(): TemplateResult {
    return html`
      <div class="select-wrapper">
        <select
          name="${ifDefined(this.name)}"
          id="${this.id}"
          class=${classMap({
            "qgds-form-control is-full-width": true,
            "is-filled": this.variant === "filled",
            "is-valid": this.validationState === "success",
            "is-invalid": this.validationState === "error",
            "is-multiple": this.multiple,
          })}
          .value=${this.selectedValues[0] ?? ""}
          @change=${this.handleChange}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?multiple=${this.multiple}
          ?autofocus=${this.autofocus}
          size="${ifDefined(this.multiple && this.size ? this.size : undefined)}"
          aria-describedby="${ifDefined(this._ariaDescribedBy)}"
          aria-invalid="${this.validationState === "error" ? "true" : "false"}"
        >
          ${!this.multiple ? html`<option value="">${this.placeholder}</option>` : ""}
        </select>
      </div>
      <slot @slotchange=${this._onSlotChange}></slot>
    `;
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
