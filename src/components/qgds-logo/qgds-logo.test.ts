import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-logo";
import type { QGDSLogo } from "./qgds-logo";

describe("qgds-logo", () => {
  let element: QGDSLogo;

  beforeEach(() => {
    element = document.createElement("qgds-logo");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.variant).toBe("masterbrand");
    expect(element.src).toBe("");
    expect(element.alt).toBe("Queensland Government logo");
    expect(element.hideSiteName).toBe(false);
    expect(element.hideImage).toBe(false);
  });

  it("renders image when src is provided", async () => {
    element.src = "logo.svg";
    element.alt = "Test logo";
    await element.updateComplete;

    const img = element.shadowRoot?.querySelector("img");
    expect(img?.getAttribute("src")).toBe("logo.svg");
    expect(img?.getAttribute("alt")).toBe("Test logo");
  });

  it("renders fallback logo when no src is provided", async () => {
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".qgds-logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 170 56");
  });

  it("renders site name text", async () => {
    element.siteName = "Department of This and That";
    await element.updateComplete;

    const main = element.shadowRoot?.querySelector(".qgds-logo-site-name-main");
    expect(main?.textContent).toBe("Department of This and That");
  });

  it("hides site name when hide-site-name is true", async () => {
    element.siteName = "Test";
    element.hideSiteName = true;
    await element.updateComplete;

    const siteName = element.shadowRoot?.querySelector(".qgds-logo-site-name");
    expect(siteName).toBeNull();
  });

  it("hides image when hide-image is true", async () => {
    element.src = "logo.svg";
    element.hideImage = true;
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector(".qgds-logo-image");
    expect(image).toBeNull();
  });

  it("applies variant class", async () => {
    element.variant = "co-brand";
    await element.updateComplete;

    const container = element.shadowRoot?.querySelector(".qgds-logo");
    expect(container?.classList.contains("qgds-logo--co-brand")).toBe(true);
  });

  it("applies has-site-name class when site name is present", async () => {
    element.siteName = "Test Site";
    await element.updateComplete;

    const container = element.shadowRoot?.querySelector(".qgds-logo");
    expect(container?.classList.contains("qgds-logo--has-site-name")).toBe(true);
  });

  it("renders custom image slot content", async () => {
    const svgContent = '<svg role="img" aria-label="Custom logo"><title>Custom logo</title></svg>';
    element.innerHTML = svgContent;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot[name="image"]');
    expect(slot).toBeDefined();
  });

  it("emits qgds-logo-loaded event when image loads", async () => {
    let eventFired = false;
    element.addEventListener("qgds-logo-loaded", () => {
      eventFired = true;
    });

    element.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>";
    await element.updateComplete;

    // Wait for image load
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(eventFired).toBe(true);
  });
});
