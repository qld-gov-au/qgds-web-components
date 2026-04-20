import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import componentCSS from "./qgds-link.styles.scss?inline";
import { baseStyles } from "../../styles";

export type Animations = "" | "leftToRight" | "rightToLeft" | "topToBottom" | "bottomToTop" | "scaleIn" | "scaleOut";
export type IconSize = "sm" | "md" | "lg" | "xl";

/**
 * A primitive link component that renders either an `<a>` or `<span>` based on the presence of an `href`.
 * Supports icons, animations, and accessible labelling.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {string} [label] - The visible link label text.
 * @property {string} [href] - The destination URL. When provided renders an `<a>`, otherwise a `<span>`.
 * @property {boolean} [disabled] - Prevents navigation and click events when true.
 * @property {string} [icon-name] - The icon identifier to display (e.g. "arrow-right", "view-all").
 * @property {IconSize} [icon-size] - Size of the icon ("sm", "md", "lg", "xl"). Defaults to "md".
 * @property {boolean} [trailing-icon] - When true, places the icon after the label text.
 * @property {boolean} [stretch] - When true, the link expands to fill available width.
 * @property {Animations} [animation] - Icon animation variant (e.g. "leftToRight", "scaleIn").
 * @property {boolean} [only-icon] - When true, the label is visually hidden (screen-reader only).
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
 * <qgds-link label="Learn more" href="/about" icon-name="arrow-right" trailing-icon></qgds-link>
 * ```
 */
@customElement("qgds-link")
export class QgdsLink extends LitElement {
  static styles = [
    ...baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String, reflect: true }) label = "";
  @property({ type: String }) href = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, attribute: "icon-name" }) iconName = "";
  @property({ type: String, attribute: "icon-size" }) iconSize: IconSize | "" = "";
  @property({ type: Boolean, reflect: true, attribute: "trailing-icon" })
  trailingIcon = false;
  @property({ type: Boolean }) stretch = false;
  @property({ type: String }) animation: Animations = "";
  @property({ type: Boolean, reflect: true, attribute: "only-icon" }) onlyIcon = false;

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has("animation")) {
      if (this.animation) {
        this.setAttribute("animation", this.animation);
      } else {
        this.removeAttribute("animation");
      }
    }
    if (changedProps.has("href")) {
      if (this.href) {
        this.setAttribute("href", this.href);
      } else {
        this.removeAttribute("href");
      }
    }
    if (changedProps.has("iconName")) {
      if (this.iconName) {
        this.setAttribute("icon-name", this.iconName);
      } else {
        this.removeAttribute("icon-name");
      }
    }
    if (changedProps.has("iconSize")) {
      if (this.iconSize) {
        this.setAttribute("icon-size", this.iconSize);
      } else {
        this.removeAttribute("icon-size");
      }
    }
    if (changedProps.has("stretch")) {
      if (this.stretch) {
        this.setAttribute("stretch", "");
      } else {
        this.removeAttribute("stretch");
      }
    }
  }

  protected _dispatchClickEvent() {
    this.dispatchEvent(
      new CustomEvent("qgds-click", {
        bubbles: true,
        composed: true,
        detail: { href: this.href, label: this.label },
      })
    );
  }

  protected _onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    this._dispatchClickEvent();
    if (!this.href.startsWith("#")) return;
    const id = this.href.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const hasHref = !!this.href;
    const iconLabel = this.iconName || undefined;
    // Only set aria-label when there is no visible text — visible label text
    // is already the accessible name and aria-label would override it.
    const ariaLabel = this.label ? undefined : (iconLabel ?? undefined);
    const labelContent = this.onlyIcon ? html`<span class="sr-only">${this.label}</span>` : this.label;
    const iconStyle = [`--qgds-icon-svg: var(--qgds-icon-${this.iconName})`].filter(Boolean).join("; ");

    return hasHref
      ? html`
          <a
            href=${this.href}
            aria-label=${ifDefined(ariaLabel)}
            @click=${(e: MouseEvent) => this._onClick(e)}
            style=${iconStyle}
          >
            <qgds-icon
              icon-id=${ifDefined(this.iconName || undefined)}
              size=${this.iconSize || "md"}
              aria-label=${this.label ? "" : this.iconName || "icon"}
            ></qgds-icon>
            ${labelContent}
          </a>
        `
      : html`
          <span style=${iconStyle} aria-label=${ifDefined(ariaLabel)}>
            <qgds-icon
              icon-id=${ifDefined(this.iconName || undefined)}
              size=${this.iconSize || "md"}
              aria-label=${this.label ? "" : this.iconName || "icon"}
            ></qgds-icon>
            ${labelContent}
          </span>
        `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-link": QgdsLink;
  }
}
