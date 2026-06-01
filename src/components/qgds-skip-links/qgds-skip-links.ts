import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-skip-links.styles.scss?inline";

export const tagName = "qgds-skip-links";

export type SkipLinksPalette = "default" | "soft" | "muted" | "bold" | "deep";

/**
 * QGDS Skip Links Component
 *
 * A web component that provides a "Skip to main content" link for improved accessibility. This allows users, especially those using screen readers or keyboard navigation, to bypass repetitive navigation links and jump directly to the main content of the page.
 *
 * @website https://www.designsystem.qld.gov.au/components/header
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 * @tagname qgds-skip-links
 *
 * @property {SkipLinksPalette} palette - The visual palette variant to apply to the skip links, defaults to "bold".
 * @property {string} ariaLabel - The accessible label for the skip link navigation, defaults to "Skip to content links".
 * @property {string} contentTarget - The CSS selector for the main content target, defaults to "#main-content".
 * @property {string} navigationTarget - The CSS selector for the main navigation target, defaults to "#main-nav".
 * @property {string} contentTargetLabel - The label for the content skip link, defaults to "Skip to main content".
 * @property {string} navigationTargetLabel - The label for the navigation skip link, defaults to "Skip to main navigation".
 *
 * @example
 * ```html
 * <qgds-skip-links 
 *  content-target=“#main-content” content-target-label=“Skip to main content” 
 *  navigation-target=“#main-nav” navigation-target-label=“Skip to main navigation” 
 * ></qgds-skip-links>
 * ```
 * 
 * ```html
 * <qgds-skip-links palette="soft" content-target=“#main-content” navigation-target=“#main-nav”></qgds-skip-links>
 * ```
 * 
 * ```html
 * <qgds-skip-links></qgds-skip-links>
 * ```
 */

@customElement(tagName)
export class QGDSSkipLinks extends LitElement {
  @property({ type: String, attribute: "aria-label" }) 
  ariaLabel: string = "Skip to content links";

  @property({ type: String, attribute: "content-target" })
  contentTarget: string = "#main-content";

  @property({ type: String, attribute: "navigation-target" })
  navigationTarget: string = "#main-nav";
  
  @property({ type: String, attribute: "content-target-label" })
  contentTargetLabel: string = "Skip to main content";

  @property({ type: String, attribute: "navigation-target-label" })
  navigationTargetLabel: string = "Skip to main navigation";

  @property({ type: String, reflect: true })
  palette: SkipLinksPalette = "bold";

  static styles = [
    baseStyles, unsafeCSS(componentCSS)
  ];

  render() {
    return html`
      <nav class="qgds-skip-links" aria-label="${this.ariaLabel}"> 
        <a class="qgds-skip-links__link" href="${this.contentTarget}">
          ${this.contentTargetLabel}
        </a>
        <a class="qgds-skip-links__link" href="${this.navigationTarget}">
          ${this.navigationTargetLabel}
        </a>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-skip-links": QGDSSkipLinks;
  }
}
