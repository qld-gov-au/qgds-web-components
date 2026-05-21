import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import componentCSS from "./qgds-video.styles.scss?inline";
import { baseStyles } from "../../styles";

import "../qgds-icon/qgds-icon.js";

export type VideoSource = "youtube" | "vimeo" | "custom" | "";
export type VideoAspect = "16x9" | "4x3" | "1x1" | "21x9";

/**
 * A click-to-play video with an optional caption and transcript disclosure.
 *
 * By default, renders a card-framed player with caption and transcript slots.
 * Set `is-trimmed` to render only the player surface — no card chrome, caption,
 * or transcript — for use inside other layouts (e.g. `<qgds-card>`).
 *
 * The play-button overlay adapts to the host's inline-size via container queries:
 * full padding ≥ 720px, compact padding < 720px, and the "Watch" text is hidden < 480px.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {VideoSource} [source] - Embed provider: "youtube", "vimeo", "custom", or "" (empty placeholder).
 * @property {string} [video-id] - YouTube / Vimeo video ID, or the full iframe URL when `source="custom"`.
 * @property {string} [thumbnail] - URL of the thumbnail image shown before play.
 * @property {string} [duration] - Display duration string (e.g. "3:12") shown on the play nav.
 * @property {VideoAspect} [aspect-ratio] - Aspect ratio of the player. Defaults to "16x9".
 * @property {boolean} [autoplay] - When true, sets `autoplay=1` in the iframe URL on initial render.
 * @property {boolean} [controls] - When true (default), shows native provider controls.
 * @property {string} [caption] - Plain-text caption rendered below the player. Ignored when `is-trimmed`.
 * @property {boolean} [is-trimmed] - When true, renders only the player surface (no card, caption, or transcript).
 *
 * @slot caption - Rich-HTML caption shown below the player. Overrides the `caption` attribute. Ignored when `is-trimmed`.
 * @slot transcript - Transcript content. When non-empty, the disclosure header ("Show/Hide transcript") is shown. Ignored when `is-trimmed`.
 *
 * @event qgds-play - Fired when the user activates the thumbnail to play. Detail: `{ source, videoId }`.
 * @event qgds-transcript-toggle - Fired when the transcript is shown/hidden. Detail: `{ open: boolean }`.
 *
 * @example
 * ```html
 * <qgds-video
 *   source="youtube"
 *   video-id="LDU_Txk06tM"
 *   thumbnail="https://img.youtube.com/vi/LDU_Txk06tM/sddefault.jpg"
 *   duration="3:12"
 *   caption="A short overview of the design system.">
 *   <div slot="transcript"><p>Full transcript text…</p></div>
 * </qgds-video>
 * ```
 */
@customElement("qgds-video")
export class QGDSVideo extends LitElement {
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
  @property({ type: String }) caption = "";
  @property({ type: Boolean, attribute: "is-trimmed", reflect: true }) isTrimmed = false;

  @state() private _playing = false;
  @state() private _transcriptOpen = false;
  @state() private _hasTranscript = false;

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

  private _handleTranscriptToggle = (e: Event): void => {
    const details = e.currentTarget as HTMLDetailsElement;
    this._transcriptOpen = details.open;
    this.dispatchEvent(
      new CustomEvent("qgds-transcript-toggle", {
        bubbles: true,
        composed: true,
        detail: { open: this._transcriptOpen },
      })
    );
  };

  private _handleTranscriptSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    this._hasTranscript = slot.assignedNodes({ flatten: true }).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE) return !!(n.textContent ?? "").trim();
      return false;
    });
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

  private _renderPlayer() {
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
                    <qgds-icon class="video-watch-icon" icon-id="play-circle" size="lg"></qgds-icon>
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

  render() {
    if (this.isTrimmed) {
      return this._renderPlayer();
    }

    const transcriptLabel = this._transcriptOpen ? "Hide transcript" : "Show transcript";
    const transcriptIcon = this._transcriptOpen ? "chevron-up" : "chevron-down";

    return html`
      <section class="video">
        ${this._renderPlayer()}

        <div class="video-caption">
          <slot name="caption">${this.caption ? html`<p>${this.caption}</p>` : nothing}</slot>
        </div>

        <details
          class=${classMap({
            "video-transcript": true,
            "is-hidden": !this._hasTranscript,
          })}
          ?open=${this._transcriptOpen}
          @toggle=${this._handleTranscriptToggle}
        >
          <summary class="video-transcript-summary">
            <qgds-icon class="video-transcript-leading" icon-id="transcript" size="sm"></qgds-icon>
            <span class="video-transcript-label">${transcriptLabel}</span>
            <qgds-icon class="video-transcript-chevron" icon-id=${transcriptIcon} size="sm"></qgds-icon>
          </summary>
          <div class="video-transcript-content">
            <slot name="transcript" @slotchange=${this._handleTranscriptSlotChange}></slot>
          </div>
        </details>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-video": QGDSVideo;
  }
}
