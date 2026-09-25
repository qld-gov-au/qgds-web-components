import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { QGDSLogo } from "./qgds-logo";
import "./qgds-logo";

describe("qgds-logo", () => {
  let element: QGDSLogo;

  beforeEach(() => {
    element = document.createElement("qgds-logo");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    vi.unstubAllGlobals();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.logo).toBe("coa-delivering-for-qld");
    expect(element.alt).toBe("");
  });

  it("renders coa-stacked logo when logo attribute is set", async () => {
    element.logo = "coa-stacked";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders coa-delivering-for-qld logo when logo attribute is set", async () => {
    element.logo = "coa-delivering-for-qld";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders logo as a link when href attribute is set", async () => {
    element.logo = "coa-stacked";
    element.href = "https://www.qld.gov.au";
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("a.logo-link");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://www.qld.gov.au");
  });

  it("renders a custom logo URL as an image", async () => {
    element.customLogo = "/agency-logo.png";
    element.customLogoAlt = "Agency";
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector<HTMLImageElement>(".logo-image-custom img");
    expect(image?.getAttribute("src")).toBe("/agency-logo.png");
    expect(image?.alt).toBe("Agency");
  });

  it("fetches an SVG URL and renders it as inline markup", async () => {
    const fetchMock = vi
      .fn<(input: string, init?: RequestInit) => Promise<Response>>()
      .mockResolvedValue(
        new Response(
          '<?xml version="1.0"?><svg viewBox="0 0 10 10"><path fill="currentColor" d="M0 0h10v10H0z"/></svg>'
        )
      );
    vi.stubGlobal("fetch", fetchMock);
    element.customLogo = "/agency-logo.svg";
    element.customLogoAlt = "Agency";

    await vi.waitFor(() => expect(element.shadowRoot?.querySelector(".custom-logo-svg svg")).toBeTruthy());

    const container = element.shadowRoot?.querySelector(".custom-logo-svg");
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/agency-logo.svg");
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBeInstanceOf(AbortSignal);
    expect(container?.querySelector("svg")).toBeTruthy();
    expect(container?.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(container?.getAttribute("aria-label")).toBe("Agency");
    expect(element.shadowRoot?.querySelector(".logo-image-custom img")).toBeNull();
  });

  it("sanitizes an SVG before rendering it as inline markup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)">
            <script>alert(1)</script>
            <a href="javascript:alert(1)"><path fill="currentColor" d="M0 0h10v10H0z" /></a>
            <foreignObject><img src="x" onerror="alert(1)" /></foreignObject>
          </svg>`
        )
      )
    );
    element.customLogo = "/agency-logo.svg";

    await vi.waitFor(() => expect(element.shadowRoot?.querySelector(".custom-logo-svg svg")).toBeTruthy());

    const svg = element.shadowRoot?.querySelector(".custom-logo-svg svg");
    expect(svg?.querySelector("path")?.getAttribute("fill")).toBe("currentColor");
    expect(svg?.hasAttribute("onload")).toBe(false);
    expect(svg?.querySelector("script")).toBeNull();
    expect(svg?.querySelector("foreignObject")).toBeNull();
    expect(svg?.querySelector("a")?.hasAttribute("href")).toBe(false);
  });

  it("falls back to an image when an SVG cannot be loaded", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    element.customLogo = "/missing-logo.svg";
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector<HTMLImageElement>(".logo-image-custom img");
    expect(image?.getAttribute("src")).toBe("/missing-logo.svg");
  });
});
