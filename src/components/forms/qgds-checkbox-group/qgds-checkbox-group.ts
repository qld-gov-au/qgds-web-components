import { html, css, unsafeCSS, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import {
  QGDSFieldGroupBase,
  type FieldGroupChangeDetail,
  type FieldGroupValue,
  type ResolvedInput,
} from "../qgds-field-group-base";
import componentCSS from "./qgds-checkbox-group.styles.scss?inline";

export type { FieldGroupValue, FieldGroupChangeDetail };

/**
 * Headless group wrapper for `<qgds-checkbox>` elements.
 * Aggregates composed `change` events from slotted checkboxes and fires
 * a single `qgds-change` event whose `detail.value` is a `string[]` of
 * all currently checked values.
 *
 * Use `<qgds-form-field>` for label, hint, and validation message rendering.
 *
 * @tagname qgds-checkbox-group
 *
 * @prop {string} name - Included in the `qgds-change` detail.
 * @prop {"sm" | "lg"} size - Visual size, propagated to all slotted checkboxes. Defaults to `"lg"`.
 *
 * @slot - Accepts `<qgds-checkbox>` or any element that dispatches a composed
 *   `change` event and exposes `.type === "checkbox"`, `.value`, `.checked`.
 *
 * @fires {CustomEvent<FieldGroupChangeDetail>} qgds-change
 *   `detail.value` is a `string[]` of checked values.
 *
 * @example
 * ```html
 * <qgds-form-field label="Interests" hint="Select all that apply.">
 *   <qgds-checkbox-group name="interests" @qgds-change=${handler}>
 *     <qgds-checkbox value="design" label="Design"></qgds-checkbox>
 *     <qgds-checkbox value="code"   label="Code"></qgds-checkbox>
 *   </qgds-checkbox-group>
 * </qgds-form-field>
 * ```
 */
@customElement("qgds-checkbox-group")
export class QGDSCheckboxGroup extends QGDSFieldGroupBase {
  static styles = [
    ...super.styles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, reflect: true })
  size: "sm" | "lg" = "lg";

  protected _initialValue(): string[] {
    return [];
  }

  protected groupItemName = "qgds-checkbox";

  protected override requiredErrorMessage = "Please select an item in the list";

  protected _applyChange(input: ResolvedInput): void {
    if (input.type !== "checkbox") return;
    const current = Array.isArray(this._value) ? [...this._value] : [];
    this._value = input.checked ? [...current, input.value] : current.filter((v) => v !== input.value);
  }

  update(changedProperties: PropertyValues): void {
    super.update(changedProperties);
    if (changedProperties.has("size")) {
      this.querySelectorAll<Element & { size?: "sm" | "lg" }>(this.groupItemName).forEach((el) => {
        el.size = this.size;
      });
    }
  }

  override renderInput() {
    return html`<div class="qgds-checkbox-group"><slot></slot></div>`;
  }
}
