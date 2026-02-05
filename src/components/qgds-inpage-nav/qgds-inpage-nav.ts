import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../js/utils";

import componentCSS from "./qgds-inpage-nav.styles.scss?inline";

type headingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type QGDSInpageNavProps = InstanceType<typeof QGDSInpageNav>;

/** QGDS In-page Navigation Web Component
 * Container for in-page navigation links. Accepts qgds-inpage-nav-item children.
 * @example
 * <qgds-inpage-nav heading="On this page">
 *   <qgds-inpage-nav-item href="#section1">Section 1</qgds-inpage-nav-item>
 *   <qgds-inpage-nav-item href="#section2">Section 2</qgds-inpage-nav-item>
 * </qgds-inpage-nav>
 *
 * @attribute heading - Navigation heading text
 * @attribute heading-level - Semantic heading level (h1-h6)
 * @attribute arialabel - Accessible label for the nav element
 * @attribute is-ordered - Whether to use an ordered list (ol) instead of unordered (ul)
 *
 * @slot - Accepts qgds-inpage-nav-item elements as children to define individual navigation items.
 */

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  @property({ type: String, attribute: "heading" })
  heading: string = "On this page";

  @property({ type: String, attribute: "heading-level" })
  headingLevel: headingLevel = "h2";

  @property({ type: String, attribute: "arialabel" })
  ariaLabel: string = "In page navigation";

  @property({ type: Boolean, attribute: "is-ordered" })
  isOrdered: boolean = false;

  static styles = css`
    ${unsafeCSS(componentCSS)}
  `;

  render() {
    // The a11y tree will be: nav > (h2) + (ol or ul) > li* > a

    return html`
      <nav aria-label="${this.ariaLabel}">
        ${semanticHeading(this.heading, this.headingLevel, "title")}
        ${this.isOrdered
          ? html`<ol>
              <slot></slot>
            </ol>`
          : html`<ul>
              <slot></slot>
            </ul>`}
      </nav>
    `;
  }
}
