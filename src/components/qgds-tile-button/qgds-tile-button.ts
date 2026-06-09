import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-tile-button.styles.scss?inline";

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
 * @property {string} href - The URL the tile button links to (if it's a link).
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
  static styles = [baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) href? = "";
  @property({ type: String, reflect: true, attribute: "icon-name" }) iconName = "";

  render() {
    const isLink = !!this.href;

    if (isLink) {
      return this._renderLink();
    }
    return this._renderButton();
  }

  private _renderButton = () => {
    return html`
      <button class="qgds-tile-button" @click="${this.handleClick}">
        <qgds-icon icon-id="${this.iconName}" size="lg"></qgds-icon>
        ${this.label}
      </button>
    `;
  }

  private _renderLink = () => {
    return html`
      <a class="qgds-tile-button" href="${this.href}" @click="${this.handleClick}">
        <qgds-icon icon-id="${this.iconName}" size="lg"></qgds-icon>
        ${this.label}
      </a>
    `;
  }

  private handleClick() {
    this.dispatchEvent(
      new CustomEvent("qgds-click", {
        detail: {
          href: this.href,
          label: this.label,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

export type QGDSTileButtonProps = InstanceType<typeof QGDSTileButton>;