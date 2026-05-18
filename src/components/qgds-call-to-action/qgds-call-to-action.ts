import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import componentCSS from "./qgds-call-to-action.styles.scss?inline";
import { resetStyles } from "../../styles";
import "../qgds-link/qgds-link.js";

/**
 * A styled call-to-action link used to promote a primary navigation action.
 * Typically placed at the bottom of a link column to direct users to a full listing.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link text. Defaults to "View all".
 * @property {string} [href] - The destination URL. Defaults to "#".
 * @property {boolean} [is-view-all] - When true, uses the "view-all" icon at size "lg". Otherwise uses "arrow-right" at size "md".
 *
 * @cssprop {length} --qgds-link-icon-size - Override the icon size (default 2rem).
 * @cssprop {length|string} --qgds-link-font-size - Override the font size (1rem by default, 1.25rem when is-view-all).
 * @cssprop {number|string} --qgds-link-font-weight - Override the font weight.
 * @cssprop {length} --qgds-link-padding - Override the link block-end padding.
 * @cssprop {length|string} --qgds-link-margin-inline-start - Override the inline-start margin.
 *
 * @example
 * ```html
 * <qgds-call-to-action label="View all services" href="/services" is-view-all></qgds-call-to-action>
 * ```
 */
@customElement("qgds-call-to-action")
export class QGDSCallToAction extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String }) label = "View all";
  @property({ type: String }) href = "#";
  @property({ type: Boolean, reflect: true, attribute: "is-view-all" }) isViewAll = false;

  render() {
    return html`
      <qgds-link
        label="${this.label}"
        href="${this.href}"
        icon-name="${this.isViewAll ? "view-all" : "arrow-right"}"
        animation="leftToRight"
        icon-size=${this.isViewAll ? "lg" : "md"}
        has-trailing-icon
      ></qgds-link>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-call-to-action": QGDSCallToAction;
  }
}
