import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { semanticHeading } from "../../js/utils";
import componentCSS from "./qgds-inpage-nav.styles.scss?inline";
import { baseStyles } from "../../scss/base/index";

// Define types for properties
interface NavItem {
  linkid: string;
  linktext: string;
}

type headingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type QGDSInpageNavProps = InstanceType<typeof QGDSInpageNav>;

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  @property({ type: String })
  navtitle: string = "On this page";

  @property({ type: Array })
  navitems: NavItem[] = [];

  @property({ type: String })
  ariaLabel: string = "In page navigation";

  @property({ type: String })
  headingLevel: headingLevel = "h2";

  static styles = [
    ...baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  render() {
    return html`
      <nav aria-label="${this.ariaLabel}">
        ${semanticHeading(this.navtitle, this.headingLevel, "title")}

        <ul>
          ${this.navitems?.map(
            (item) => html`
              <li>
                <a href="#${item.linkid}">${item.linktext}</a>
              </li>
            `,
          )}
        </ul>
      </nav>
    `;
  }
}
