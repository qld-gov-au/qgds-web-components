import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-inpage-nav.styles.scss?inline";

// Define types for properties
interface NavItem {
  linkid: string;
  linktext: string;
}

type HeadlineLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  @property({ type: String })
  navtitle: string = "On this page";

  @property({ type: Array })
  navitems: NavItem[] = [];

  @property({ type: String })
  ariaLabel: string = "In page navigation";

  @property({ type: String })
  headlineLevel: HeadlineLevel = "h2";

  static styles = css`
    ${unsafeCSS(componentCSS)}
  `;

  private renderTitle() {
    switch (this.headlineLevel) {
      case "h1":
        return html`<h1 class="title">${this.navtitle}</h1>`;
      case "h2":
        return html`<h2 class="title">${this.navtitle}</h2>`;
      case "h3":
        return html`<h3 class="title">${this.navtitle}</h3>`;
      case "h4":
        return html`<h4 class="title">${this.navtitle}</h4>`;
      case "h5":
        return html`<h5 class="title">${this.navtitle}</h5>`;
      case "h6":
        return html`<h6 class="title">${this.navtitle}</h6>`;
      default:
        return html`<h2 class="title">${this.navtitle}</h2>`;
    }
  }

  render() {
    return html`
      <nav aria-label="${this.ariaLabel}">
        ${this.renderTitle()}
        <ul>
          ${this.navitems.map(
            (item) => html`
              <li>
                <a href="#${item.linkid}">${item.linktext}</a>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }
}
