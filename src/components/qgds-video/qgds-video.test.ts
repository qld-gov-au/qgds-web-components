import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-video.js";
import "../qgds-video-player/qgds-video-player.js";
import type { QGDSVideo } from "./qgds-video.js";
import type { QGDSVideoPlayer } from "../qgds-video-player/qgds-video-player.js";

describe("qgds-video", () => {
  let element: QGDSVideo;

  beforeEach(() => {
    element = document.createElement("qgds-video") as QGDSVideo;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders a default qgds-video-player with the forwarded props", async () => {
    element.source = "youtube";
    element.videoId = "abc123";
    element.duration = "1:23";
    element.aspectRatio = "4x3";
    element.controls = false;
    await element.updateComplete;

    const player = element.shadowRoot?.querySelector<QGDSVideoPlayer>("qgds-video-player");
    expect(player).toBeTruthy();
    expect(player?.source).toBe("youtube");
    expect(player?.videoId).toBe("abc123");
    expect(player?.duration).toBe("1:23");
    expect(player?.aspectRatio).toBe("4x3");
    expect(player?.controls).toBe(false);
  });

  it("uses the player slot when content is provided", async () => {
    const customPlayer = document.createElement("qgds-video-player") as QGDSVideoPlayer;
    customPlayer.setAttribute("slot", "player");
    customPlayer.source = "vimeo";
    customPlayer.videoId = "999";
    element.appendChild(customPlayer);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="player"]');
    const assigned = slot?.assignedElements();
    expect(assigned?.[0]).toBe(customPlayer);
  });

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

  it("toggles the transcript label and fires qgds-transcript-toggle when opened", async () => {
    const node = document.createElement("p");
    node.setAttribute("slot", "transcript");
    node.textContent = "Hello world.";
    element.appendChild(node);
    await new Promise((r) => setTimeout(r, 0));
    await element.updateComplete;

    const details = element.shadowRoot?.querySelector<HTMLDetailsElement>(".video-transcript");
    let toggled: { open: boolean } | undefined;
    element.addEventListener("qgds-transcript-toggle", (e) => {
      toggled = (e as CustomEvent).detail;
    });

    details!.open = true;
    details!.dispatchEvent(new Event("toggle"));
    await element.updateComplete;

    expect(toggled).toEqual({ open: true });
    expect(element.shadowRoot?.querySelector(".video-transcript-label")?.textContent?.trim()).toBe("Hide transcript");
  });
});
