import { LitElement, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link.styles.scss?inline";
import { baseStyles } from "../../styles";
import { QgdsEvents } from "../../utils";
import "../qgds-icon/qgds-icon.js";
import type { IconSize } from "../qgds-icon/qgds-icon.js";

export type Animations =
  | ""
  | "leftToRight"
  | "rightToLeft"
  | "topToBottom"
  | "bottomToTop"
  | "scaleIn"
  | "scaleOut"
  | "rotateIn"
  | "rotateOut";
export type { IconSize };

/**
 * A primitive link component that renders either an `<a>` or `<span>` based on the presence of an `href`.
 * Supports icons, animations, and accessible labelling.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link label text.
 * @property {string} [href] - The destination URL. When provided renders an `<a>`, otherwise a `<span>`.
 * @property {boolean} [is-disabled] - Prevents navigation and click events when true.
 * @property {string} [icon-name] - The icon identifier to display (e.g. "arrow-right", "view-all").
 * @property {IconSize} [icon-size] - Size of the icon ("sm", "md", "lg", "xl"). Defaults to "md".
 * @property {boolean} [has-trailing-icon] - When true, places the icon after the label text.
 * @property {boolean} [stretch] - When true, the link expands to fill available width.
 * @property {Animations} [animation] - Icon animation variant (e.g. "leftToRight", "scaleIn").
 * @property {boolean} [only-icon] - When true, the label is visually hidden (screen-reader only). Has no effect when no `icon-name` is set.
 *
 * @cssprop {length} --qgds-link-padding - Override the link block-end padding.
 * @cssprop {length} --qgds-link-icon-size - Override the icon size.
 * @cssprop {length|string} --qgds-link-font-size - Override the link font size.
 * @cssprop {number|string} --qgds-link-font-weight - Override the link font weight.
 * @cssprop {length|string} --qgds-link-margin-inline-start - Override the inline-start margin.
 * @cssprop {length|string} --qgds-link-width - Override the link width.
 * @cssprop {string} --qgds-link-justify-content - Override the flex justification.
 * @cssprop {color} --qgds-link-background-colour - Override the link background colour.
 * @cssprop {string} --qgds-link-flex-direction - Override the flex direction (e.g. "row-reverse").
 * @cssprop {color} --qgds-link-border-end-colour - Override the block-end border colour.
 * @cssprop {length} --qgds-link-border-end-width - Override the block-end border width.
 * @cssprop {string} --qgds-link-border-end-style - Override the block-end border style.
 * @cssprop {length} --qgds-link-padding-inline-start - Override the inline-start padding.
 * @cssprop {length} --qgds-icon-margin-start - Override the icon inline-start margin.
 *
 * @event qgds-click - Emitted when the link is clicked. Event payload includes `{ href: string, label: string }`.
 *
 * @example
 * ```html
 * <qgds-link label="Learn more" href="/about" icon-name="arrow-right" has-trailing-icon></qgds-link>
 * ```
 */
@customElement("qgds-link")
export class QGDSLink extends LitElement {
  static styles = [...baseStyles, unsafeCSS(componentCSS)];

  @property({ type: String, reflect: true }) label = "";
  @property({ type: String, reflect: true }) href? = "";
  @property({ type: Boolean, reflect: true, attribute: "is-disabled" }) isDisabled = false;
  @property({ type: String, reflect: true, attribute: "icon-name" }) iconName = "";
  @property({ type: String, reflect: true, attribute: "icon-size" }) iconSize: IconSize = "md";
  @property({ type: Boolean, reflect: true, attribute: "has-trailing-icon" })
  hasTrailingIcon = false;
  @property({ type: Boolean, reflect: true }) stretch = false;
  @property({ type: String, reflect: true }) animation?: Animations | null;
  @property({ type: Boolean, reflect: true, attribute: "only-icon" }) onlyIcon = false;

  private events = new QgdsEvents(this);

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("iconName") && !this.iconName && changedProperties.get("iconName")) {
      this.removeAttribute("icon-size");
      this.removeAttribute("has-trailing-icon");
      this.removeAttribute("stretch");
      this.removeAttribute("only-icon");
      this.removeAttribute("animation");
    }
  }

  protected _onClick(e: MouseEvent) {
    if (this.isDisabled) {
      e.preventDefault();
      return;
    }
    this.events.dispatch("click", { href: this.href, label: this.label }, e);
  }

  render() {
    const hasHref = !!this.href;
    // Only set aria-label when there is no visible text — visible label text
    // is already the accessible name and aria-label would override it.
    const ariaLabel = this.label ? undefined : this.iconName || undefined;
    const labelContent = this.iconName && this.onlyIcon ? html`<span class="sr-only">${this.label}</span>` : this.label;
    const iconStyle = this.iconName ? `--qgds-icon-svg: var(--qgds-icon-${this.iconName})` : "";
    const iconTemplate = this.iconName
      ? html`<qgds-icon icon-id=${this.iconName} size=${this.iconSize} aria-hidden="true"></qgds-icon>`
      : "";

    return hasHref
      ? html`
          <a
            href=${this.href}
            aria-label=${ifDefined(ariaLabel)}
            @click=${(e: MouseEvent) => this._onClick(e)}
            style=${iconStyle}
          >
            ${iconTemplate} ${labelContent}
          </a>
        `
      : html` <span aria-label=${ifDefined(ariaLabel)}> ${iconTemplate} ${labelContent} </span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link": QGDSLink;
  }
}
