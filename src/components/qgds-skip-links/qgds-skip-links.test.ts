import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-skip-links";
import type { QGDSSkipLinks } from "./qgds-skip-links";

describe("qgds-skip-links", () => {
  let element: QGDSSkipLinks;

  beforeEach(() => {
    element = document.createElement("qgds-skip-links");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.contentTarget).toBe("#main-content");
    expect(element.navigationTarget).toBe("#main-nav");
    expect(element.contentTargetLabel).toBe("Skip to main content");
    expect(element.navigationTargetLabel).toBe("Skip to main navigation");
    expect(element.palette).toBe("bold");
  });

  it("renders skip links with default hrefs and labels", async () => {
    await element.updateComplete;

    const links = element.shadowRoot?.querySelectorAll("a");

    expect(links?.length).toBe(2);

    expect(links?.[0]?.getAttribute("href")).toBe("#main-content");
    expect(links?.[0]?.textContent?.trim()).toBe("Skip to main content");

    expect(links?.[1]?.getAttribute("href")).toBe("#main-nav");
    expect(links?.[1]?.textContent?.trim()).toBe("Skip to main navigation");
  });

  it("passes custom targets and labels through to the links", async () => {
    element.contentTarget = "#content";
    element.navigationTarget = "#navigation";
    element.contentTargetLabel = "Skip to content";
    element.navigationTargetLabel = "Skip to navigation";

    await element.updateComplete;

    const links = element.shadowRoot?.querySelectorAll("a");

    expect(links?.[0]?.getAttribute("href")).toBe("#content");
    expect(links?.[0]?.textContent?.trim()).toBe("Skip to content");

    expect(links?.[1]?.getAttribute("href")).toBe("#navigation");
    expect(links?.[1]?.textContent?.trim()).toBe("Skip to navigation");
  });

  it.each(["default", "soft", "muted", "bold", "deep"] as const)(
    "reflects palette=%s to the host attribute",
    async (palette) => {
      element.palette = palette;
      await element.updateComplete;

      expect(element.getAttribute("palette")).toBe(palette);
    }
  );
});
