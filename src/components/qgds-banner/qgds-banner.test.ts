import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-banner";
import "../qgds-button/qgds-button";
import type { QGDSBanner } from "./qgds-banner";

describe("qgds-banner", () => {
  let element: QGDSBanner;

  beforeEach(() => {
    element = document.createElement("qgds-banner");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("registers the custom element", () => {
    expect(customElements.get("qgds-banner")).toBeDefined();
  });

  it("renders the heading and subheading when provided", async () => {
    element.heading = "Page title";
    element.subHeading = "Page subtitle";

    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".banner-heading");
    const subHeading = element.shadowRoot?.querySelector(".banner-sub-heading");
    const wrapper = element.shadowRoot?.querySelector("h1");

    expect(wrapper).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe("Page title");
    expect(subHeading?.textContent?.trim()).toBe("Page subtitle");
  });

  it("renders slotted abstract and breadcrumbs", async () => {
    element.variant = "advanced";
    element.innerHTML = `
      <div class="slot-abstract">Renew your licence.</div>
      <qgds-breadcrumbs slot="breadcrumbs" aria-label="Breadcrumbs">
        <qgds-breadcrumbs-item href="/home">Home</qgds-breadcrumbs-item></qgds-breadcrumbs>
      <div slot="cta"><qgds-button target="_self" type="button" aria-label="Primary Action" label="Primary" variant="primary" href="https://www.qld.gov.au" id=""></qgds-button></div>
    `;

    await element.updateComplete;

    const slotted = element.querySelector(".slot-abstract");
    const breadcrumbsSlot = element.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='breadcrumbs']");

    expect(slotted).not.toBeNull();
    expect(breadcrumbsSlot).toBeTruthy();

    expect(slotted?.textContent).toBe("Renew your licence.");
    expect(breadcrumbsSlot?.assignedNodes().some((node) => node.textContent?.trim() === "Home")).toBe(true);
  });

  it("renders slotted cta content", async () => {
    element.variant = "advanced";
    element.heading = "Page title";
    element.innerHTML = `      
      <qgds-button slot="cta" target="_self" type="button" aria-label="Primary Action" label="Primary" variant="primary" href="https://www.qld.gov.au" id=""></qgds-button>
    `;

    await element.updateComplete;
    const ctaSlot = element.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='cta']");

    expect(ctaSlot).toBeTruthy();
    expect(ctaSlot?.assignedElements().some((node) => node.getAttribute("href") === "https://www.qld.gov.au")).toBe(
      true
    );
  });

  it("applies the block-heading class when requested", async () => {
    element.heading = "Heading";
    element.isBlockTypeHeading = true;

    await element.updateComplete;

    const wrapper = element.shadowRoot?.querySelector(".banner-heading-wrapper");

    expect(wrapper?.classList.contains("block-type")).toBe(true);
  });

  it("adds background image styles and mobile image markup for image banners", async () => {
    element.backgroundOption = "image";
    element.imageUrl = "https://example.com/banner.jpg";
    element.smallImageUrl = "https://example.com/banner-mobile.jpg";
    element.imageDescription = "Banner image";

    await element.updateComplete;

    const section = element.shadowRoot?.querySelector("section");
    const mobileImage = element.shadowRoot?.querySelector(".banner-image-mobile");

    expect(section?.getAttribute("style")).toContain("background-image:url(https://example.com/banner.jpg)");
    expect(mobileImage?.getAttribute("role")).toBe("img");
    expect(mobileImage?.getAttribute("aria-label")).toBe("Banner image");
    expect(mobileImage?.getAttribute("style")).toContain("background-image:url(https://example.com/banner-mobile.jpg)");
  });

  it("renders the hero image container for hero-image banners", async () => {
    element.backgroundOption = "hero-image";
    element.imageUrl = "https://example.com/hero.jpg";
    element.imageDescription = "Hero image";
    element.imageOption = "fixed-image-ratio";

    await element.updateComplete;

    const bannerInner = element.shadowRoot?.querySelector(".banner-inner");
    const imageContainer = element.shadowRoot?.querySelector(".banner-image-container");
    const heroImage = element.shadowRoot?.querySelector(".banner-image");

    expect(bannerInner?.classList.contains("has-hero-image")).toBe(true);
    expect(imageContainer?.classList.contains("fixed-image-ratio")).toBe(true);
    expect(heroImage?.getAttribute("role")).toBe("img");
    expect(heroImage?.getAttribute("aria-label")).toBe("Hero image");
    expect(heroImage?.getAttribute("style")).toContain("background-image:url(https://example.com/hero.jpg)");
  });
});
