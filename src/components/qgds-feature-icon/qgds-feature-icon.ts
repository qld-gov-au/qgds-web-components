import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-feature-icon.styles.scss?inline";

import "../qgds-icon/qgds-icon";

export type QGDSFeatureIconSize = "sm" | "lg";

/**
 * QGDS Feature Icon Component
 *
 * A web component for displaying feature icons in the Queensland Government Design System (QGDS). This component uses the QGDS Icon component to render icons based on the provided icon name and size.
 *
 * @uikit https://www.figma.com/design/APANArEk8nHGbgQk12sR7a/Queensland-Government-Design-System--UI-Kit--Community-?node-id=9652-250374
 * @website https://www.designsystem.qld.gov.au/styles/iconography
 *
 * @prop {string} iconId - The ID of the icon to display (e.g., "home", "alert-success")
 * @prop {"sm" | "lg"} size - The size of the feature icon. Options are "sm" (small) and "lg" (large). Default is "sm".
 **/

@customElement("qgds-feature-icon")
export class QGDSFeatureIcon extends LitElement {
  @property({ type: String, attribute: "icon-id" })
  iconId?: string;

  @property({ type: String, attribute: "size", reflect: true })
  size: QGDSFeatureIconSize = "sm";

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    if (!this.iconId || this.iconId.trim() === "") {
      console.warn("QGDSFeatureIcon: An 'icon-id' attribute is required to display an icon.");
      return html``; // Render nothing if iconId is not provided
    }

    return html`
      <div class="qgds-feature-icon size-${this.size}">
        <qgds-icon icon-id=${ifDefined(this.iconId)}></qgds-icon>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-feature-icon": QGDSFeatureIcon;
  }
}
