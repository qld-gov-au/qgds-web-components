import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../qgds-icon/qgds-icon";
import styles from "./qgds-inpage-alert.styles.scss?inline";
import display from "../../scss/typography/qgds-display.scss?inline";
import { ICON_NAMES } from "../qgds-icon/icon-names";

type AlertVariant = "error" | "info" | "success" | "warning";
type IconName = (typeof ICON_NAMES)[number]; // Gets the literal type of each icon

// Register the custom element
@customElement("qgds-inpage-alert")
export class QGDSInpageAlert extends LitElement {
  // Define properties for the component
  @property({ type: String })
  heading?: string;

  @property({ type: String })
  variant: AlertVariant = "info";

  // Define styles for the component
  static styles = [
    css`
      ${unsafeCSS(display)}
    `,

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
          <qgds-icon
            iconId="${QGDSInpageAlert.icons[this.variant]}"
          ></qgds-icon>
        </div>

        <div class="content-wrapper">
          ${this.heading &&
          html`<h3 class="heading qgds-display-lg">${this.heading}</h3>`}
          <slot></slot>
        </div>
      </section>
    `;
  }
}

export type QGDSInpageAlertProps = InstanceType<typeof QGDSInpageAlert>;
