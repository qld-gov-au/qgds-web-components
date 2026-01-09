import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import componentCSS from "./qgds-inpage-nav.css?inline";

// Define types for properties
interface NavItem {
  linkid: string;
  linktext: string;
}

type NavVariant = "default" | "dark";

@customElement("qgds-inpage-nav")
export class QGDSInpageNav extends LitElement {
  @property({ type: String })
  navtitle: string = "On this page";

  @property({ type: Array })
  navitems: NavItem[] = [];

  @property({ type: String, reflect: true })
  variant: NavVariant = "default";

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
      .qld-inpage-nav {
        border-left: 4px solid var(--qld-inpage-nav-border-color);
        padding-left: var(--qld-inpage-nav-padding-left);
        font-family: var(--qgds-font-family);
      }

      ul.nav {
        display: flex;
        flex-direction: column;
        padding-left: 0;
        margin-top: 0.75rem;
        list-style: none;
      }

      .nav-title {
        font-size: 1rem;
        line-height: 1.25;
        margin-bottom: 0;
        padding-left: var(--qld-inpage-nav-title-padding-left);
      }

      .nav-item {
        margin-top: 0;
        display: inline-flex;
      }

      .nav-link {
        padding-top: var(--qld-inpage-nav-link-padding-y);
        padding-bottom: var(--qld-inpage-nav-link-padding-y);
        padding-left: var(--qld-inpage-nav-title-padding-left);
        padding-right: 0;
        color: var(--qld-nav-link-color);
        text-decoration-line: underline;
      }

      .nav-link:hover,
      .nav-link:visited {
        text-decoration-color: var(--qld-link-underline);
      }

      .nav-item:first-child .nav-link {
        padding-top: 0;
      }

      .nav-item:last-child .nav-link {
        padding-bottom: 0;
      }

      /* Dark variant styles */
      :host([variant="dark"]) .qld-inpage-nav,
      :host([variant="dark-alt"]) .qld-inpage-nav {
        --qld-inpage-nav-border-color: var(--qld-dark-action-primary, #ffffff);
        background-color: var(--qld-brand-primary, #0085b3);
        padding: 2rem;
        border-radius: 4px;
      }

      :host([variant="dark"]) .nav,
      :host([variant="dark-alt"]) .nav {
        --qld-nav-link-color: var(--qld-neutral-white, #ffffff);
        --qld-nav-link-hover-color: var(--qld-brand-accent, #e6f4f9);
      }

      :host([variant="dark"]) .nav-title,
      :host([variant="dark-alt"]) .nav-title {
        color: var(--qld-neutral-white, #ffffff);
      }
    `,
  ];

  render() {
    return html`
      <nav class="qld-inpage-nav" aria-label="In page navigation">
        <h2 class="nav-title">${this.navtitle}</h2>
        <ul class="nav">
          ${this.navitems.map(
            (item) => html`
              <li class="nav-item">
                <a class="nav-link" href="#${item.linkid}">${item.linktext}</a>
              </li>
            `
          )}
        </ul>
      </nav>
    `;
  }
}
