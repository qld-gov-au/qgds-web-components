import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import componentCSS from "./qgds-video.styles.scss?inline";
import { baseStyles } from "../../styles";

import "../qgds-icon/qgds-icon.js";
import "../qgds-video-player/qgds-video-player.js";
import type { VideoSource, VideoAspect, VideoSize } from "../qgds-video-player/qgds-video-player.js";

export type { VideoSource, VideoAspect, VideoSize };

/**
 * A video card composed of `<qgds-video-player>` (the click-to-play surface), an optional
 * caption, and an optional transcript disclosure.
 *
 * The player can be customised in two ways:
 * 1. Pass the source props (`source`, `video-id`, `thumbnail`, …) — the component renders
 *    an internal `<qgds-video-player>` from them.
 * 2. Slot a `<qgds-video-player>` (or any compatible element) in the `player` slot to
 *    replace the default player entirely.
 *
 * @uikit https://www.figma.com/design/qKsxl3ogIlBp7dafgxXuCA/QGDS-UI-kit
 *
 * @property {VideoSource} [source] - Forwarded to the default `qgds-video-player`.
 * @property {string} [video-id] - Forwarded to the default `qgds-video-player`.
 * @property {string} [thumbnail] - Forwarded to the default `qgds-video-player`.
 * @property {string} [duration] - Forwarded to the default `qgds-video-player`.
 * @property {VideoAspect} [aspect-ratio] - Forwarded to the default `qgds-video-player`.
 * @property {boolean} [autoplay] - Forwarded to the default `qgds-video-player`.
 * @property {boolean} [controls] - Forwarded to the default `qgds-video-player`.
 * @property {string} [caption] - Plain-text caption rendered below the player.
 * @property {VideoSize} [size] - Card width + play-button density: `"xl"` (12 cols, default), `"md"` (8 cols, max 864px), or `"sm"` (6 cols). Forwarded to the inner `qgds-video-player`.
 *
 * @slot player - Replaces the default `<qgds-video-player>`. The source/etc attributes are ignored when used.
 * @slot caption - Rich-HTML caption shown below the player. Overrides the `caption` attribute.
 * @slot transcript - Transcript content. When non-empty, the disclosure header ("Show/Hide transcript") is shown.
 *
 * @event qgds-play - Bubbled from the inner player. Detail: `{ source, videoId }`.
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
  @property({ type: String, reflect: true }) size: VideoSize = "xl";

  @state() private _transcriptOpen = false;
  @state() private _hasTranscript = false;

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

  render() {
    const transcriptLabel = this._transcriptOpen ? "Hide transcript" : "Show transcript";
    const transcriptIcon = this._transcriptOpen ? "chevron-up" : "chevron-down";

    return html`
      <section class="video">
        <slot name="player">
          <qgds-video-player
            .source=${this.source}
            .videoId=${this.videoId}
            .thumbnail=${this.thumbnail}
            .duration=${this.duration}
            .aspectRatio=${this.aspectRatio}
            .autoplay=${this.autoplay}
            .controls=${this.controls}
            .size=${this.size}
          ></qgds-video-player>
        </slot>

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
