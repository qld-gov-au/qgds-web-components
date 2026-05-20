import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-correct-incorrect.styles.scss?inline";

import "../qgds-icon/qgds-icon";
import { IconName } from "../qgds-icon/icon-names";

// type Variant = "list" | "table";
type Status = "correct" | "incorrect";

/**
 * QGDS Correct Incorrect Component
 *
 * @todo Waiting for designer on the following information:
 * @uikit ""
 * @website ""
 * @tagname qgds-correct-incorrect
 *
 * @prop {Status} [status = "correct"] - The status of the component, which determines the styling and icon used. It can be either "correct" or "incorrect".
 * 
 * @todo: To add Variant or not to add Variant
 * @prop {Variant} [variant = "list"] - The variant of the component, which determines the layout and styling. It can be either "list" or "table".
 **/

@customElement("qgds-correct-incorrect")
export class QGDSCorrectIncorrect extends LitElement {
  @property({ type: String }) status: Status = "correct";
//   @property({ type: String }) variant: Variant = "list";

  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    const correctIcon = "alert-success" satisfies IconName;
    const incorrectIcon = "alert-cancel" satisfies IconName;

    return html`
      <div class="qgds-correct-incorrect ${this.status}">
        <qgds-icon icon-id="${this.status === "correct" ? correctIcon : incorrectIcon}" size="md" class="default-icon" aria-hidden="true"></qgds-icon>
        <div class="content"><slot></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-correct-incorrect": QGDSCorrectIncorrect;
  }
}