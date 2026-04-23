import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../qgds-link/qgds-link.js";

export type Direction = "up" | "down" | "left" | "right";

const ICON_BY_DIRECTION = {
  up: "arrow-up",
  down: "arrow-down",
  left: "arrow-left",
  right: "arrow-right",
} as const;

const ANIMATION_BY_DIRECTION = {
  up: "bottomToTop",
  down: "topToBottom",
  left: "rightToLeft",
  right: "leftToRight",
} as const;

/**
 * A direction link component that wraps `<qgds-link>` with a fixed directional arrow icon.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link label text.
 * @property {string} [href] - The destination URL.
 * @property {Direction} [direction] - The arrow direction ("up", "down", "left", "right"). Defaults to "right".
 * @property {boolean} [trailing] - When true, places the arrow after the label text.
 * @property {boolean} [animation] - When true (default), animates the arrow in the matching direction. Set to false to disable.
 *
 * @example
 * ```html
 * <qgds-direction-link label="Next" href="/next" direction="right" trailing></qgds-direction-link>
 * ```
 */
@customElement("qgds-direction-link")
export class QgdsDirectionLink extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) href = "";
  @property({ type: String, reflect: true }) direction: Direction = "right";
  @property({ type: Boolean, reflect: true }) trailing = false;
  @property({ type: Boolean, reflect: true }) animation = true;

  render() {
    const iconName = ICON_BY_DIRECTION[this.direction];
    const animation = this.animation ? ANIMATION_BY_DIRECTION[this.direction] : "";
    return html`
      <qgds-link
        .label=${this.label}
        .href=${this.href}
        .iconName=${iconName}
        .animation=${animation}
        .trailingIcon=${this.trailing}
      ></qgds-link>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-direction-link": QgdsDirectionLink;
  }
}
