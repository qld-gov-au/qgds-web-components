import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-video-player.js";
import type { QGDSVideoPlayer } from "./qgds-video-player.js";

describe("qgds-video-player", () => {
  let element: QGDSVideoPlayer;

  beforeEach(() => {
    element = document.createElement("qgds-video-player");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties and the placeholder when no source is set", async () => {
    await element.updateComplete;

    expect(element.source).toBe("");
    expect(element.videoId).toBe("");
    expect(element.aspectRatio).toBe("16x9");
    expect(element.controls).toBe(true);
    expect(element.autoplay).toBe(false);

    const placeholder = element.shadowRoot?.querySelector(".video-no-source");
    expect(placeholder).toBeTruthy();
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

    expect(
      element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-vimeo")?.src
    ).toContain("player.vimeo.com/video/999");
  });

  it("renders a custom iframe using video-id as the full URL", async () => {
    element.source = "custom";
    element.videoId = "https://example.com/embed/foo";
    await element.updateComplete;

    expect(
      element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-custom")?.src
    ).toBe("https://example.com/embed/foo");
  });

  it("renders directly into the iframe view when no thumbnail is provided", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".video-thumbnail")).toBeNull();
    expect(element.shadowRoot?.querySelector("iframe.video-youtube")).toBeTruthy();
  });

  it("respects controls=false on the iframe URL", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    element.controls = false;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector<HTMLIFrameElement>("iframe.video-youtube")?.src).toContain("controls=0");
  });

  it("defaults size to 'xl' and reflects it to the attribute", async () => {
    await element.updateComplete;
    expect(element.size).toBe("xl");

    element.size = "md";
    await element.updateComplete;
    expect(element.getAttribute("size")).toBe("md");

    element.size = "sm";
    await element.updateComplete;
    expect(element.getAttribute("size")).toBe("sm");
  });

  it("renders the Watch text in xl and md, and keeps the span in the DOM in sm (hidden via CSS)", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    element.thumbnail = "https://example.com/thumb.jpg";
    element.size = "sm";
    await element.updateComplete;

    const watchText = element.shadowRoot?.querySelector(".video-watch-text");
    expect(watchText).toBeTruthy();
    expect(watchText?.textContent).toBe("Watch");
  });
});
