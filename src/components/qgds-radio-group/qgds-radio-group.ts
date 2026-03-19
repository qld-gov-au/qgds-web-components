import { customElement } from "lit/decorators.js";

import {
  QGDSFieldGroupBase,
  type FieldGroupChangeDetail,
  type FieldGroupValue,
  type ResolvedInput,
} from "../../utils/abstracts/qgds-field-group-base";

export type { FieldGroupValue, FieldGroupChangeDetail };
export type QGDSRadioGroupProps = InstanceType<typeof QGDSRadioGroup>;

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
}
