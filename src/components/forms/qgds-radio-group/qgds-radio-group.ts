import { html, unsafeCSS, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  QGDSFieldGroupBase,
  type FieldGroupChangeDetail,
  type FieldGroupValue,
  type ResolvedInput,
} from "../qgds-field-group-base";
import componentCSS from "./qgds-radio-group.styles.scss?inline";

export type { FieldGroupValue, FieldGroupChangeDetail };

/**
 * Headless group wrapper for `<qgds-radio>` elements.
 * Aggregates composed `change` events from slotted radios, enforces mutual
 * exclusivity across shadow roots, and fires a `qgds-change` event whose
 * `detail.value` is the currently selected `string`.
 *
 * Use `<qgds-form-field>` for label, hint, and validation message rendering.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=11056-321347
 * @website https://www.designsystem.qld.gov.au/components/radio
 *
 * @prop {string} name - Included in the `qgds-change` detail.
 * @prop {"sm" | "lg"} size - Visual size, propagated to all slotted radios. Defaults to `"lg"`.
 *
 * @slot - Accepts `<qgds-radio>` or any element that dispatches a composed
 *   `change` event and exposes `.type === "radio"`, `.value`, `.checked`.
 *
 * @fires {CustomEvent<FieldGroupChangeDetail>} qgds-change
 *   `detail.value` is the selected radio's value string.
 *
 * @example
 * ```html
 * <qgds-form-field label="Priority" hint="Choose one.">
 *   <qgds-radio-group name="priority" @qgds-change=${handler}>
 *     <qgds-radio value="low"  label="Low"></qgds-radio>
 *     <qgds-radio value="high" label="High"></qgds-radio>
 *   </qgds-radio-group>
 * </qgds-form-field>
 * ```
 */
@customElement("qgds-radio-group")
export class QGDSRadioGroup extends QGDSFieldGroupBase {
  static styles = [...super.styles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true })
  size: "sm" | "lg" = "lg";

  protected _initialValue(): string {
    return "";
  }

  protected groupItemName = "qgds-radio";

  protected _applyChange(input: ResolvedInput, source: EventTarget): void {
    if (input.type !== "radio") return;
    this._value = input.value;
    // Enforce mutual exclusivity — native radio grouping does not work across
    // shadow roots, so sibling qgds-radio elements are deselected explicitly.
    this.querySelectorAll<Element & { checked?: boolean }>(this.groupItemName).forEach((el) => {
      if (el !== source) el.checked = false;
    });
  }

  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("size")) {
      this.querySelectorAll<Element & { size?: "sm" | "lg" }>(this.groupItemName).forEach((el) => {
        el.size = this.size;
      });
    }
  }

  override renderInput() {
    return html`<div class="qgds-radio-group"><slot></slot></div>`;
  }
}
