import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-video-player.styles.scss?inline";
import { baseStyles } from "../../styles";

import "../qgds-icon/qgds-icon.js";

export type VideoSource = "youtube" | "vimeo" | "custom" | "";
export type VideoAspect = "16x9" | "4x3" | "1x1" | "21x9";
/**
 * Compactness of the play-button overlay. Controls padding, height, and text visibility.
 * - `"xl"` (default) — full Watch + duration row.
 * - `"md"` — 32px tall, 12px inline padding.
 * - `"sm"` — 24px tall, 12px inline padding, "Watch" text hidden.
 */
export type VideoSize = "xl" | "md" | "sm";

/**
 * The core "click to play" video player surface — a thumbnail with a Watch/duration
 * overlay that swaps to an embedded iframe (YouTube / Vimeo / custom) on activation.
 *
 * Intended as a building block: drop it into `<qgds-video>`, `<qgds-card>`, or any other
 * container. It owns no border, shadow, or surrounding card chrome — frame it from the
 * outside as the layout requires.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {VideoSource} [source] - Embed provider: "youtube", "vimeo", "custom", or "" (empty placeholder).
 * @property {string} [video-id] - YouTube / Vimeo video ID, or the full iframe URL when `source="custom"`.
 * @property {string} [thumbnail] - URL of the thumbnail image shown before play.
 * @property {string} [duration] - Display duration string (e.g. "3:12") shown on the nav.
 * @property {VideoAspect} [aspect-ratio] - Aspect ratio of the player. Defaults to "16x9".
 * @property {boolean} [autoplay] - When true, sets `autoplay=1` in the iframe URL on initial render.
 * @property {boolean} [controls] - When true (default), shows native provider controls.
 * @property {VideoSize} [size] - Play-button compactness: `"xl"` (default), `"md"` (32px), or `"sm"` (24px, no text).
 *
 * @event qgds-play - Fired when the user activates the thumbnail to play. Detail: `{ source, videoId }`.
 *
 * @example
 * ```html
 * <qgds-video-player
 *   source="youtube"
 *   video-id="LDU_Txk06tM"
 *   thumbnail="https://img.youtube.com/vi/LDU_Txk06tM/sddefault.jpg"
 *   duration="3:12">
 * </qgds-video-player>
 * ```
 */
@customElement("qgds-video-player")
export class QGDSVideoPlayer extends LitElement {
  static styles = [
    ...baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  @property({ type: String }) source: VideoSource = "";
  @property({ type: String, attribute: "video-id" }) videoId = "";
  @property({ type: String }) thumbnail = "";
  @property({ type: String }) duration = "";
  @property({ type: String, attribute: "aspect-ratio", reflect: true })
  aspectRatio: VideoAspect = "16x9";
  @property({ type: Boolean }) autoplay = false;
  @property({ type: Boolean, useDefault: true }) controls = true;
  @property({ type: String, reflect: true }) size: VideoSize = "xl";

  /** Internal: switches from thumbnail view to iframe view. */
  @state() private _playing = false;

  private _buildIframeSrc(autoplay: boolean): string {
    if (!this.videoId) return "";
    const ap = autoplay ? "1" : "0";
    const ct = this.controls ? "1" : "0";
    switch (this.source) {
      case "youtube":
        return `https://www.youtube.com/embed/${this.videoId}?rel=0&autoplay=${ap}&controls=${ct}`;
      case "vimeo":
        return `https://player.vimeo.com/video/${this.videoId}?rel=0&autoplay=${ap}&controls=${ct}`;
      case "custom":
        return this.videoId;
      default:
        return "";
    }
  }

  private _handlePlay = async (e: Event): Promise<void> => {
    e.preventDefault();
    if (!this.source || !this.videoId) return;
    this._playing = true;
    this.dispatchEvent(
      new CustomEvent("qgds-play", {
        bubbles: true,
        composed: true,
        detail: { source: this.source, videoId: this.videoId },
      })
    );
    await this.updateComplete;
    this.renderRoot.querySelector<HTMLIFrameElement>(".video-embed iframe")?.focus();
  };

  private _renderEmbed() {
    const src = this._buildIframeSrc(this.autoplay || this._playing);
    if (!src) {
      return html`<p class="video-no-source">A video has not been provided.</p>`;
    }
    const title =
      this.source === "youtube" ? "YouTube video" : this.source === "vimeo" ? "Vimeo video" : "Embedded video";
    return html`
      <iframe
        class="video-iframe video-${this.source}"
        title=${title}
        src=${src}
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
        loading="lazy"
      ></iframe>
    `;
  }

  render() {
    const ready = !!this.source && !!this.videoId;
    const showThumbnail = ready && !!this.thumbnail && !this._playing;

    const playerClasses = {
      "video-player": true,
      [`ratio-${this.aspectRatio}`]: true,
    };

    return html`
      <div class=${classMap(playerClasses)}>
        ${showThumbnail
          ? html`
              <a
                href="#"
                class="video-thumbnail"
                title="Play video"
                aria-label=${ifDefined(this.duration ? `Watch video — duration ${this.duration}` : "Watch video")}
                @click=${this._handlePlay}
              >
                <span
                  class="video-thumbnail-image"
                  style="background-image: url(${this.thumbnail})"
                  role="presentation"
                ></span>
                <span class="video-nav">
                  <span class="video-watch">
                    <qgds-icon icon-id="play-circle" size=${this.size === "xl" ? "lg" : "md"}></qgds-icon>
                    <span class="video-watch-text">Watch</span>
                  </span>
                  ${this.duration
                    ? html`
                        <span class="video-duration" title="Video duration">
                          <qgds-icon icon-id="clock" size="sm"></qgds-icon>
                          <span>${this.duration}</span>
                        </span>
                      `
                    : nothing}
                </span>
              </a>
            `
          : nothing}
        <div class="video-embed">${this._renderEmbed()}</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-video-player": QGDSVideoPlayer;
  }
}
