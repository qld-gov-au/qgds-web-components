import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../qgds-icon/qgds-icon";
import styles from "./qgds-inpage-alert.styles.scss?inline";
//import display from "../../styles/typography/qgds-display.scss?inline";
import { resetStyles, typographyStyles } from "../../styles";
import { IconName } from "../qgds-icon/icon-names";
import { semanticHeading } from "../../utils";

type AlertVariant = "error" | "info" | "success" | "warning";
type HeadingLevel = 2 | 3 | 4 | 5 | 6;

/**
 * QGDS in-page alert
 * In-page alerts are a helpful tool for informing users about essential updates or modifications on a webpage, all while capturing their attention without disrupting their ongoing task. Usually positioned at the top of a page after a submit action, these alerts are designed to be noticeable yet unobtrusive.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=5990-98125&p=f&t=t7qJTAaoKBjwJfej-0
 * @website https://www.designsystem.qld.gov.au/components/in-page-alert
 *
 * @prop {AlertVariant} [variant="info"] The alert variant, either "error", "info", "success", "warning".
 * @prop {string} [heading] The alert heading text.
 * @prop {HeadingLevel} [headingLevel=3] Determines the heading level (h2-h6)
 *
 * @cssprop --icon-color Override the color of the displayed icon
 * @cssprop --background Override the color of the background.
 * @cssprop --border Override the border color.
 *
 * @slot - Default content slot.
 */
@customElement("qgds-inpage-alert")
export class QGDSInpageAlert extends LitElement {
  // Define properties for the component
  @property({ type: String })
  heading?: string;

  @property({ type: String, useDefault: true })
  variant: AlertVariant = "info";

  @property({
    type: Number,
    attribute: "heading-level",
    converter: {
      fromAttribute: (value: string) => {
        const int = parseInt(String(value).replace(/\D/g, ""));
        if (isNaN(int) || int < 2 || int > 6) {
          return 3;
        } else return int;
      },
      toAttribute: (value: number) => {
        return value.toString();
      },
    },
  })
  headingLevel: HeadingLevel = 3;

  // Define styles for the component
  static styles = [
    resetStyles,
    typographyStyles,

    css`
      ${unsafeCSS(styles)}
    `,
  ];

  private static readonly icons: Record<AlertVariant, IconName> = {
    error: "alert-danger",
    info: "alert-information",
    success: "alert-success",
    warning: "alert-warning",
  };

  render() {
    return html`
      <section class="qgds-inpage-alert is-${this.variant}">
        <div class="icon-wrapper">
          <qgds-icon icon-id="${QGDSInpageAlert.icons[this.variant]}" size="sm"></qgds-icon>
        </div>

        <div class="content-wrapper">
          ${this.heading && semanticHeading(this.heading, this.headingLevel, "heading qgds-display-lg")}
          <slot></slot>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-inpage-alert": QGDSInpageAlert;
  }
}
