import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { resetStyles } from "../../styles";
import { semanticHeading } from "../../utils";

import componentCSS from "./qgds-inpage-nav.styles.scss?inline";

type headingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type QGDSInpageNavProps = InstanceType<typeof QGDSInpageNav>;

/** QGDS In-page Navigation Web Component
 * In-page navigation is a vertical list of links that helps users scan the contents of a page and navigate to different sections of the page
 *
 * @example
 * <qgds-inpage-nav heading="On this page">
 *   <qgds-inpage-nav-item href="#section1">Section 1</qgds-inpage-nav-item>
 *   <qgds-inpage-nav-item href="#section2">Section 2</qgds-inpage-nav-item>
 * </qgds-inpage-nav>
 *
 * @attribute heading - Navigation heading text
 * @attribute heading-level - Semantic heading level (h1-h6)
 * @attribute aria-label - Accessible label for the navigation landmark, defaults to "On this page navigation"
 * @attribute is-ordered - Whether to use an ordered list (ol) instead of unordered (ul)
 */

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  static styles = [
    resetStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, attribute: "heading" })
  heading: string = "On this page";

  @property({ type: String, attribute: "heading-level", useDefault: true })
  headingLevel: headingLevel = "h2";

  @property({ type: Boolean, attribute: "is-ordered" })
  isOrdered: boolean = false;

  @property({ type: String, attribute: "aria-label" })
  label: string = "On this page navigation";

  render() {
    // The a11y tree will be: nav > (h2) + (ol or ul) > li* > a

    return html`
      <nav aria-label="${ifDefined(this.label)}">
        ${semanticHeading(this.heading, this.headingLevel, "title")}
        ${this.isOrdered
          ? // eslint-disable-next-line lit-a11y/list
            html` <ol>
              <slot></slot>
            </ol>`
          : // eslint-disable-next-line lit-a11y/list
            html` <ul>
              <slot></slot>
            </ul>`}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-inpage-nav": QGDSInpageNav;
  }
}
