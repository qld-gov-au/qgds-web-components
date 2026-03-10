import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { QGDSSelectOption } from "./qgds-select-option.js";

/**
 * QGDS Select OptGroup Web Component
 * Used as a child element within {@link QGDSSelect} to group related options with a label.
 * Only accepts {@link QGDSSelectOption} elements as children - other elements will be ignored.
 *
 * @element qgds-select-optgroup
 *
 * @example
 * ```html
 * <qgds-select label="Choose a pet">
 *   <qgds-select-optgroup label="Common Pets">
 *     <qgds-select-option value="dog" label="Dog"></qgds-select-option>
 *     <qgds-select-option value="cat" label="Cat"></qgds-select-option>
 *   </qgds-select-optgroup>
 *   <qgds-select-optgroup label="Exotic Pets">
 *     <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
 *     <qgds-select-option value="snake" label="Snake"></qgds-select-option>
 *   </qgds-select-optgroup>
 * </qgds-select>
 * ```
 *
 * @attribute {string} label - The label for this group of options.
 * @attribute {boolean} disabled - Whether all options in this group are disabled.
 */

export type QGDSSelectOptgroupProps = InstanceType<typeof QGDSSelectOptgroup>;

@customElement("qgds-select-optgroup")
export class QGDSSelectOptgroup extends LitElement {
  @property({ type: String }) label: string = "";
  @property({ type: Boolean, reflect: true }) disabled: boolean = false;

  /**
   * Get all qgds-select-option children
   */
  getOptions(): QGDSSelectOption[] {
    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) return [];

    const assignedElements = slot.assignedElements({ flatten: true });
    return assignedElements.filter(
      (el) => el.tagName.toLowerCase() === "qgds-select-option",
    ) as QGDSSelectOption[];
  }

  /**
   * Validate that only qgds-select-option elements are slotted
   */
  private _handleSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    const assignedElements = slot.assignedElements({ flatten: true });

    // Check for invalid elements
    const invalidElements = assignedElements.filter(
      (el) => el.tagName.toLowerCase() !== "qgds-select-option",
    );

    if (invalidElements.length > 0) {
      console.warn(
        "qgds-select-optgroup only accepts qgds-select-option elements as children. " +
          "The following invalid elements will be ignored:",
        invalidElements,
      );
    }
  };

  /**
   * Convert this custom element to a native HTMLOptGroupElement
   */
  toNativeOptgroup(): HTMLOptGroupElement {
    const optgroup = document.createElement("optgroup");
    optgroup.label = this.label;
    optgroup.disabled = this.disabled;

    // Convert all child options to native options
    const options = this.getOptions();
    options.forEach((customOption) => {
      const nativeOption = customOption.toNativeOption();
      // Apply group disabled state to options if group is disabled
      if (this.disabled) {
        nativeOption.disabled = true;
      }
      optgroup.appendChild(nativeOption);
    });

    return optgroup;
  }

  render() {
    // Render semantic optgroup element with validation for child elements
    return html`<optgroup label="${this.label}" ?disabled=${this.disabled}>
      <slot @slotchange=${this._handleSlotChange}></slot>
    </optgroup>`;
  }
}

// Augment global types
declare global {
  interface HTMLElementTagNameMap {
    "qgds-select-optgroup": QGDSSelectOptgroup;
  }
}
