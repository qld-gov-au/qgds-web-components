import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { QgdsEvents } from "../../utils";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-tile-button.styles.scss?inline";
import { IconName } from "../qgds-icon/icon-names";

export const tagName = "qgds-tile-button";

/**
 * QGDS Tile Button component
 *
 * A tile button is a large, clickable element that can contain an icon and a label. It is used on mobile Header and Tiles Advanced banner.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 * @tagname qgds-tile-button
 *
 * @property {string} label - The label of the tile button.
 * @property {string} [href] - The URL the tile button links to (if it's a link).
 * @property {string} icon-name - The name of the icon to display in the tile button.
 *
 * @event qgds-click - Emitted when the link is clicked. Event payload includes `{ href: string, label: string }`.
 *
 * @example
 * <qgds-tile-button label="Tile Button" icon-name="design"></qgds-tile-button>
 * <qgds-tile-button label="Tile Button Link" icon-name="design" href="/pathhere"></qgds-tile-button>
 */

@customElement(tagName)
export class QGDSTileButton extends LitElement {
  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) href?: string;
  @property({ type: String, reflect: true, attribute: "icon-name" }) iconName!: IconName;
  private events: QgdsEvents = new QgdsEvents(this);

  static styles = [baseStyles, unsafeCSS(componentCSS)];

  private _handleClick = (e: Event) => {
    if (this.href) {
      e.preventDefault();
    }
    this.events.dispatch("click", { label: this.label }, e);
  };

  render() {
    return this.href
      ? html`
          <a class="qgds-tile-button" href="${this.href}" @click="${this._handleClick}">
            <qgds-icon icon-id="${this.iconName}"></qgds-icon>
            ${this.label}
          </a>
        `
      : html`
          <button class="qgds-tile-button" @click="${this._handleClick}">
            <qgds-icon icon-id="${this.iconName}"></qgds-icon>
            ${this.label}
          </button>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-tile-button": QGDSTileButton;
  }
}
