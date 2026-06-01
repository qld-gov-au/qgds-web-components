import { LitElement, html, unsafeCSS, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { resetStyles } from "../../styles";
import componentCSS from "./qgds-image.styles.scss?inline";

export type QGDSImageProps = InstanceType<typeof QGDSImage>;

/**
 * The QGDS image component renders images with consistent ratios caption styling, responsive performance and and accessible controls.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit?node-id=23805-301812&m=dev
 * @website https://www.designsystem.qld.gov.au/components/image
 * @tag qgds-image
 *
 * @prop {String} src - Image source URL
 * @prop {String} alt - Alternative text for the image
 * @prop {Number} width - Image width
 * @prop {Number} height - Image height
 *
 * @prop {String} aspect - Optional aspect ratio of the image (e.g. "16:9", "4:3", "1:1"). If not set, image uses natural dimensions
 *
 * @prop {String} caption - Optional caption text for the image
 * @prop {String} hotspot - Optional hotspot position for focal point (e.g., "30, 70" for x%, y%). If not set, uses browser default positioning
 * @prop {Boolean} decorative - Marks the image as decorative (no alt text needed). Sets alt="", role="presentation", and aria-hidden="true"
 * @prop {String} aria-label - ARIA label to override alt text for context-specific descriptions
 * @prop {String} aria-describedby - ID of element containing long description for complex images (charts, diagrams)
 * @prop {String} loading - Loading strategy for the image. Either "lazy" (default) or "eager"
 * @prop {String} fetchpriority - Priority hint for fetching the image. Use "high" for LCP images, "low" for non-critical images
 * @prop {String} decoding - Image decoding hint. "async" prevents blocking of page rendering
 * @prop {String} srcset - Responsive image sources for different resolutions/sizes
 * @prop {String} sizes - Describes the rendered size of the image for responsive loading
 * @prop {String} referrerpolicy - Referrer policy for the image request. Controls what information is sent in the Referer header.
 *
 * @slot - Default content slot accepts general typographic HTML content, including paragraphs, lists, and links.
 */

// Enum of image rations supported by the component, based on common aspect ratios used in design systems and web content.
// This allows for consistent image dimensions and responsive performance across different content types.
type AspectRatios = "16:9" | "9:16" | "2:1" | "1:2" | "3:2" | "2:3" | "4:3" | "3:4" | "1:1";

@customElement("qgds-image")
export class QGDSImage extends LitElement {
  @property({ type: String, reflect: true, attribute: "src" })
  src: string = "";

  @property({ type: String, reflect: true, attribute: "alt" })
  alt: string = "";

  @property({ type: Number, attribute: "width" })
  width: number = 0;

  @property({ type: Number, attribute: "height" })
  height: number = 0;

  @property({ type: String, reflect: true, attribute: "aspect" })
  aspect?: AspectRatios;

  @property({ type: String, attribute: "caption" })
  caption?: string = "";

  @property({ type: String, attribute: "hotspot" })
  hotspot?: string;

  @property({ type: Boolean, attribute: "decorative" })
  decorative: boolean = false;

  @property({ type: String, attribute: "aria-label" })
  ariaLabel: string | null = null;

  @property({ type: String, attribute: "aria-describedby" })
  ariaDescribedby?: string;

  @property({ type: String, attribute: "referrerpolicy" })
  referrerpolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  @property({ type: String, attribute: "loading" })
  loading?: "lazy" | "eager";

  @property({ type: String, attribute: "fetchpriority" })
  fetchpriority?: "high" | "low" | "auto";

  @property({ type: String, attribute: "decoding" })
  decoding?: "async" | "sync" | "auto";

  @property({ type: String, attribute: "srcset" })
  srcset?: string;

  @property({ type: String, attribute: "sizes" })
  sizes?: string;

  @property({ type: String, attribute: "align" })
  align?: "left" | "right";

  static styles = [resetStyles, unsafeCSS(componentCSS)];

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
   * Generates a unique ID for the figcaption element.
   */
  private getCaptionId = () => `qgds-img-caption-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Derives the explicit inline-size to apply to the wrapper element.
   * When `width` is set, that value is used directly.
   * When `aspect` and `height` are both set, the width is calculated from the ratio.
   * Returns undefined when width should be determined by the parent container.
   */
  private get wrapperInlineSize(): string | undefined {
    if (this.width) return `${this.width}px`;
    if (this.aspect && this.height) {
      const [wr, hr] = this.aspect.split(":").map(Number);
      if (Number.isFinite(wr) && Number.isFinite(hr) && hr > 0) {
        return `${(this.height * wr) / hr}px`;
      }
    }
    return undefined;
  }

  private inferPriority = () => {
    if (!this.aspect) return "is-horizontal";
    const [w, h] = this.aspect.split(":").map(Number);
    return w > h ? "is-horizontal" : "is-vertical";
  };

  render() {
    const ratio = this.formatAspectRatio(this.aspect);

    const wrapperClasses = {
      "image-wrap": true,
      [this.inferPriority()]: true,
      [`align-${this.align}`]: !!this.align,
    };

    // Parse hotspot values (e.g., "30, 40" -> [30, 40]) only if hotspot is set
    const objectPosition = this.hotspot
      ? (() => {
          const [hotspotX = 50, hotspotY = 50] = this.hotspot.split(",").map((v) => parseFloat(v.trim()));
          return { "object-position": `${hotspotX}% ${hotspotY}%` };
        })()
      : {};

    // If 'aspect-ratio' is null/undefined, Lit omits it from the DOM.
    const imgStyles = {
      ...(ratio ?? {}),
      ...objectPosition,
      // Height constrains the image only — the wrapper grows to fit img + figcaption (req #3)
      ...(this.height ? { "max-block-size": `${this.height}px` } : {}),
    };

    // Only render style attribute if there are actual styles to apply
    const hasStyles = Object.keys(imgStyles).length > 0;

    // Wrapper inline-size: applied when width is explicitly set or derivable from aspect + height.
    // This ensures figcaption always matches the image width (req #1, #2).
    // Omitted by default so the component fills its container (req #5).
    const wrapperInlineSize = this.wrapperInlineSize;
    const wrapperStyles = wrapperInlineSize ? { "inline-size": wrapperInlineSize } : {};
    const hasWrapperStyles = Object.keys(wrapperStyles).length > 0;

    // Accessibility: Determine effective alt text
    const effectiveAlt = this.decorative ? "" : this.alt;

    // Accessibility: Warn if not decorative and no alt text provided
    if (!this.decorative && !this.alt && !this.ariaLabel) {
      console.warn(
        `qgds-image: Missing alt text for image "${this.src}". ` +
          `Provide alt text for accessibility or mark as decorative with decorative attribute.`
      );
    }

    // Accessibility: Generate unique ID for caption if needed
    const captionId = this.caption ? this.getCaptionId() : undefined;

    // Accessibility: Determine aria-describedby
    const ariaDescribedbyValue = this.ariaDescribedby ?? captionId;

    // DRY: Define the <img> tag once
    const imageTag = html`
      <img
        src="${this.src}"
        alt="${effectiveAlt}"
        width="${ifDefined(this.width || undefined)}"
        height="${ifDefined(this.height || undefined)}"
        srcset="${ifDefined(this.srcset)}"
        sizes="${ifDefined(this.sizes)}"
        style=${hasStyles ? styleMap(imgStyles) : nothing}
        loading="${ifDefined(this.loading)}"
        fetchpriority="${ifDefined(this.fetchpriority)}"
        decoding="${ifDefined(this.decoding)}"
        referrerpolicy="${ifDefined(this.referrerpolicy)}"
        role="${ifDefined(this.decorative ? "presentation" : undefined)}"
        aria-hidden="${ifDefined(this.decorative ? "true" : undefined)}"
        aria-label="${ifDefined(this.ariaLabel ?? undefined)}"
        aria-describedby="${ifDefined(ariaDescribedbyValue)}"
      />
    `;

    return html`
      ${this.caption
        ? html`
            <figure class=${classMap(wrapperClasses)} style=${hasWrapperStyles ? styleMap(wrapperStyles) : nothing}>
              ${imageTag}
              <figcaption id=${ifDefined(captionId)}>${unsafeHTML(this.caption)}</figcaption>
            </figure>
          `
        : html` <div class=${classMap(wrapperClasses)} style=${hasWrapperStyles ? styleMap(wrapperStyles) : nothing}>
            ${imageTag}
          </div>`}
    `;
  }
}
