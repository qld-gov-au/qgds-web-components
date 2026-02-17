import { LitElement, html, css, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-image.styles.scss?inline";

export type QGDSImageProps = InstanceType<typeof QGDSImage>;

/**
 * The QGDS image component renders images with consistent ratios caption styling, responsive performance and and accessible controls.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=23805-301812&m=dev
 * @website https://www.designsystem.qld.gov.au/components/image
 * @tagname qgds-image
 *
 * @attribute src - Image source URL
 * @attribute alt - Alternative text for the image
 * @attribute width - Image width
 * @attribute height - Image height
 *
 * @attribute aspect - Aspect ratio of the image (e.g. "16:9", "4:3", "1:1") to maintain consistent image dimensions across different content
 *
 * @attribute caption - Optional caption text for the image
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 */

// Enum of image rations supported by the component, based on common aspect ratios used in design systems and web content.
// This allows for consistent image dimensions and responsive performance across different content types.
type AspectRatios = "16:9" | "1:2" | "3:2" | "4:3" | "1:1" | "3:4" | "2:3";

@customElement("qgds-image")
export class QGDSImage extends LitElement {
  @property({ type: String, reflect: true, attribute: "src" })
  src: string = "";

  @property({ type: String, reflect: true, attribute: "alt" })
  alt: string = "";

  @property({ type: String, reflect: true, attribute: "width" })
  width: string = "";

  @property({ type: String, reflect: true, attribute: "height" })
  height: string = "";

  @property({ type: String, reflect: true, attribute: "aspect" })
  aspect?: AspectRatios = "3:2";

  @property({ type: String, reflect: true, attribute: "caption" })
  caption: string = "";

  static styles = [
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  /**
   * Converts a ratio string (e.g., "16:9") to a CSS aspect-ratio value ("16 / 9").
   * Returns null if the input is invalid or missing.
   */
  private formatAspectRatio(ratio?: string): Record<string, string> | null {
    const parts = ratio?.split(":");

    if (parts?.length !== 2) return null;

    const [w, h] = parts.map((p) => p.trim());

    // Return an object compatible with styleMap
    return {
      "--ratio-w": w,
      "--ratio-h": h,
    };
  }

  /**
   * Infers the priority class based on the aspect ratio.
   * @returns string
   */
  private inferPriority = () => {
    if (!this.aspect || this.aspect === "custom") return "is-horizontal";
    const [w, h] = this.aspect.split(":").map(Number);
    return w > h ? "is-horizontal" : "is-vertical";
  };

  render() {
    const ratio = this.formatAspectRatio(this.aspect);

    const wrapperStyles = {
      width: this.width ? `${this.width}px` : undefined,
      height: this.height ? `${this.height}px` : undefined,
    };

    const wrapperClasses = {
      "image-wrap": true,
      "has-caption": !!this.caption,
      [this.inferPriority()]: true,
    };

    // If 'aspect-ratio' is null/undefined, Lit omits it from the DOM.
    const imgStyles = ratio ?? undefined;

    // If any class is null/undefined, Lit omits it from the DOM.
    const imgClasses = {
      "is-overlay": this.captionPosition === "overlay",
    };

    return html`
      <div class=${classMap(wrapperClasses)} style=${styleMap(wrapperStyles)}>
        <img
          src="${this.src}"
          alt="${ifDefined(this.alt)}"
          width="${ifDefined(this.width)}"
          height="${ifDefined(this.height)}"
          style=${styleMap(imgStyles)}
          class=${classMap(imgClasses)} />

        <!-- Caption -->
        ${this.caption
          ? html`<div class="caption">${unsafeHTML(this.caption)}</div>`
          : ""}
      </div>
    `;
  }
}
