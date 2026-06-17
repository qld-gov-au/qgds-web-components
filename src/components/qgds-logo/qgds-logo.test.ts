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

    expect(element.logo).toBe("");
    expect(element.alt).toBe("Queensland Government logo");
    expect(element.hideSiteName).toBe(false);
    expect(element.hideImage).toBe(false);
  });

  it("renders no logo image when logo and slot are not provided", async () => {
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".qgds-logo-image") as HTMLElement | null;
    expect(logoContainer).toBeTruthy();
    expect(logoContainer?.hasAttribute("hidden")).toBe(true);
  });

  it("renders coa-stacked logo when logo attribute is set", async () => {
    element.logo = "coa-stacked";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".qgds-logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 170 56");
  });

  it("renders coa-delivering-for-qld logo when logo attribute is set", async () => {
    element.logo = "coa-delivering-for-qld";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".qgds-logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 331 56");
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
    element.logo = "coa-stacked";
    element.hideImage = true;
    await element.updateComplete;

    const image = element.shadowRoot?.querySelector(".qgds-logo-image");
    expect(image).toBeNull();
  });

  it("applies has-site-name class when site name is present", async () => {
    element.siteName = "Test Site";
    await element.updateComplete;

    const container = element.shadowRoot?.querySelector(".qgds-logo");
    expect(container?.classList.contains("qgds-logo--has-site-name")).toBe(true);
  });

  it("renders custom image slot content", async () => {
    element.innerHTML = '<img slot="image" src="logo-a.svg" alt="Logo A" />';
    await Promise.resolve();
    await element.updateComplete;

    const imageContainer = element.shadowRoot?.querySelector(".qgds-logo-image");
    expect(imageContainer).toBeTruthy();

    const slot = element.shadowRoot?.querySelector('slot[name="image"]') as HTMLSlotElement | null;
    expect(slot).toBeDefined();
    const assigned = slot?.assignedElements({ flatten: true }) ?? [];
    expect(assigned.length).toBe(1);
    expect(assigned[0]?.getAttribute("slot")).toBe("image");
  });

  it("renders slot image when added after initial render", async () => {
    await element.updateComplete;
    const initialImageContainer = element.shadowRoot?.querySelector(".qgds-logo-image") as HTMLElement | null;
    expect(initialImageContainer).toBeTruthy();
    expect(initialImageContainer?.hasAttribute("hidden")).toBe(true);

    const img = document.createElement("img");
    img.setAttribute("slot", "image");
    img.setAttribute("src", "logo-b.svg");
    img.setAttribute("alt", "Logo B");
    element.appendChild(img);
    await Promise.resolve();
    await element.updateComplete;

    const imageContainer = element.shadowRoot?.querySelector(".qgds-logo-image");
    expect(imageContainer).toBeTruthy();
  });
});
