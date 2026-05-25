import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-video.js";
import type { QGDSVideo } from "./qgds-video.js";

describe("qgds-video", () => {
  let element: QGDSVideo;

  beforeEach(() => {
    element = document.createElement("qgds-video");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  // ── Player surface ────────────────────────────────────────────────────

  it("renders the placeholder when no source is set", async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".video-no-source")).toBeTruthy();
  });

  it("shows the thumbnail overlay when source, video-id, and thumbnail are provided", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    element.thumbnail = "https://example.com/thumb.jpg";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".video-thumbnail")).toBeTruthy();
    expect(element.shadowRoot?.querySelector(".video-watch")?.textContent).toContain("Watch");
  });

  it("renders a YouTube iframe with the expected src", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    await element.updateComplete;

    const iframe = element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-youtube");
    expect(iframe?.src).toContain("youtube.com/embed/abc123");
    expect(iframe?.src).toContain("autoplay=0");
    expect(iframe?.src).toContain("controls=1");
  });

  it("renders a Vimeo iframe with the expected src", async () => {
    element.source = "vimeo";
    element.videoId = "999";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-vimeo")?.src).toContain(
      "player.vimeo.com/video/999"
    );
  });

  it("renders a custom iframe using video-id as the full URL", async () => {
    element.source = "custom";
    element.videoId = "https://example.com/embed/foo";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-custom")?.src).toBe(
      "https://example.com/embed/foo"
    );
  });

  it("hides provider controls when hide-controls is set", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    element.hideControls = true;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-youtube")?.src).toContain("controls=0");
  });

  // ── Caption / transcript ──────────────────────────────────────────────

  it("renders the caption from the caption attribute", async () => {
    element.caption = "Caption text goes here";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".video-caption")?.textContent).toContain("Caption text goes here");
  });

  it("hides the transcript disclosure when no transcript content is slotted", async () => {
    await element.updateComplete;
    const transcript = element.shadowRoot?.querySelector(".video-transcript");
    expect(transcript?.classList.contains("is-hidden")).toBe(true);
  });

  it("reveals the transcript disclosure when transcript content is slotted", async () => {
    const node = document.createElement("p");
    node.setAttribute("slot", "transcript");
    node.textContent = "Hello world.";
    element.appendChild(node);
    await new Promise((r) => setTimeout(r, 0));
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".video-transcript")?.classList.contains("is-hidden")).toBe(false);
    expect(element.shadowRoot?.querySelector(".video-transcript-label")?.textContent?.trim()).toBe("Show transcript");
  });

  // ── Trimmed mode ──────────────────────────────────────────────────────

  it("skips card chrome, caption, and transcript when is-trimmed", async () => {
    element.isTrimmed = true;
    element.source = "youtube";
    element.videoId = "abc123";
    element.caption = "ignored";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".video")).toBeNull();
    expect(element.shadowRoot?.querySelector(".video-caption")).toBeNull();
    expect(element.shadowRoot?.querySelector(".video-transcript")).toBeNull();
    expect(element.shadowRoot?.querySelector(".video-player")).toBeTruthy();
    expect(element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-youtube")).toBeTruthy();
  });

  it("reflects is-trimmed to the host attribute", async () => {
    element.isTrimmed = true;
    await element.updateComplete;
    expect(element.hasAttribute("is-trimmed")).toBe(true);
  });
});
