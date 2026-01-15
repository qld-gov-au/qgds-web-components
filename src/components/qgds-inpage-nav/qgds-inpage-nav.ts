import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-inpage-nav.css?inline";

// Define types for properties
interface NavItem {
  linkid: string;
  linktext: string;
}

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  @property({ type: String })
  navtitle: string = "On this page";

  @property({ type: Array })
  navitems: NavItem[] = [];

  constructor() {
    super();
  }

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
    css`
      :host {
        display: block;
      }

      /* General styling rules matching QGDS SCSS implementation */
      nav {
        border-left: 4px solid var(--qld-inpage-nav-border-color);
        padding-left: var(--qld-inpage-nav-padding-left);
        font-family: var(--qgds-font-family);
      }

      ul {
        display: flex;
        flex-direction: column;
        padding-left: 0;
        margin-top: 0.75rem;
        list-style: none;
      }

      h2 {
        font-size: 1rem;
        line-height: 1.25;
        margin-bottom: 0;
        padding-left: var(--qld-inpage-nav-title-padding-left);
      }

      li {
        margin-top: 0;
        display: inline-flex;
      }

      a {
        padding-top: var(--qld-inpage-nav-link-padding-y);
        padding-bottom: var(--qld-inpage-nav-link-padding-y);
        padding-left: var(--qld-inpage-nav-title-padding-left);
        padding-right: 0;
        color: var(--qld-nav-link-color);
        text-decoration-line: underline;
      }

      a:hover,
      a:visited {
        text-decoration-color: var(--qld-link-underline);
      }

      li:first-child a {
        padding-top: 0;
      }

      li:last-child a {
        padding-bottom: 0;
      }
    `,
  ];

  render() {
    return html`
      <nav aria-label="In page navigation">
        <h2>${this.navtitle}</h2>
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
