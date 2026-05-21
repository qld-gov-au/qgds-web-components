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
 * @property {boolean} [animation] - When true (default), animates the arrow in the matching direction. Set to false to disable.
 * @property {boolean} [hasScroll] - When true, scroll to the target element for hash links. Defaults to false.
 *
 * @example
 * ```html
 * <qgds-direction-link label="Next" href="/next" direction="right"></qgds-direction-link>
 * ```
 * @example
 * Back to Top link
 * ```html
 * <qgds-direction-link label="Back to top" href="#top" direction="up" has-scroll></qgds-direction-link>
 * <qgds-direction-link label="Back to top" href="#" direction="up" has-scroll></qgds-direction-link>
 * ```
 */
@customElement("qgds-direction-link")
export class QGDSDirectionLink extends LitElement {
  @property({ type: String }) label = "";
  @property({ type: String }) href = "";
  @property({ type: String, reflect: true }) direction: Direction = "right";
  @property({ type: Boolean, reflect: true }) animation = true;
  @property({ type: Boolean, reflect: true, attribute: "has-scroll" }) hasScroll = false;

  private _handleScrollClick = (event: Event) => {
    if (!this.hasScroll || !this.href?.includes('#')) return;

    const [path, hash] = this.href.split('#');
    const isSamePage = !path || path === window.location.pathname || path === window.location.href;
    if (!isSamePage) return;

    event.preventDefault();

    if (!hash) {
      // Scroll to top when href="#"
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      // Scroll to the target element
      document.getElementById(hash)?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  render() {
    const iconName = ICON_BY_DIRECTION[this.direction];
    const animation = this.animation ? ANIMATION_BY_DIRECTION[this.direction] : null;
    const trailingIcon = this.direction !== "left";

    return html`
      <qgds-link
        label=${this.label}
        href=${this.href}
        icon-name=${iconName}
        .animation=${animation}
        .hasTrailingIcon=${trailingIcon}
        @click=${this._handleScrollClick}
      ></qgds-link>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-direction-link": QGDSDirectionLink;
  }
}
