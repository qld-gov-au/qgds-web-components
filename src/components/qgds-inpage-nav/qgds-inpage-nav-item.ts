import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resetStyles } from "../../scss/base/index";

import componentCSS from "./qgds-inpage-nav-item.styles.scss?inline";

/** QGDS In-page Navigation Item Web Component
 * Used as a child element within {@link qgds-inpage-nav} to define individual navigation items.
 *
 * @example
 * <qgds-inpage-nav-item href="#section1">Section 1</qgds-inpage-nav-item>
 *
 * @attribute href - The target URL or anchor for the navigation item
 * @tag qgds-inpage-nav-item
 *
 */

export type QGDSInpageNavItemProps = InstanceType<typeof QGDSInpageNavItem>;

@customElement("qgds-inpage-nav-item")
export class QGDSInpageNavItem extends LitElement {
  // This ensures the custom element tag (:host) acts like an <li> in the A11y tree
  connectedCallback() {
    super.connectedCallback(); // eslint-disable-line -- linter fails to recognise that LitElement always contains connectedCallback
    this.setAttribute("role", "listitem");
  }

  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "href" })
  href: string = "";

  render() {
    return html`
      <a href="${this.href}">
        <slot></slot>
      </a>
    `;
  }
}
