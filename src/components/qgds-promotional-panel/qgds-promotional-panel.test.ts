import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-promotional-panel";
import type { QGDSPromotionalPanel } from "./qgds-promotional-panel";

describe("qgds-promotional-panel", () => {
  let element: QGDSPromotionalPanel;

  beforeEach(() => {
    element = document.createElement("qgds-promotional-panel");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("registers the custom element", () => {
    expect(customElements.get("qgds-promotional-panel")).toBeDefined();
  });

  it("renders heading, abstract, image, and iconName by default", async () => {
    element.heading = "Promo heading";
    element.abstract = "Promo abstract";
    element.imageUrl = "/assets/promo.png";
    element.imageDescription = "Promo image alt";

    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector("h2");
    const abstract = element.shadowRoot?.querySelector(".promo-abstract");
    const image = element.shadowRoot?.querySelector("img.panel-image");
    const icon = element.shadowRoot?.querySelector("qgds-feature-icon");

    expect(heading?.textContent).toBe("Promo heading");
    expect(abstract?.textContent).toBe("Promo abstract");
    expect(image).toBeTruthy();
    expect(image?.getAttribute("src")).toBe("/assets/promo.png");
    expect(image?.getAttribute("alt")).toBe("Promo image alt");
    expect(icon).toBeTruthy();
  });

  it("renders light DOM slot content inside the main slot", async () => {
    element.innerHTML = "<p class='slot-text'>Extra content</p>";
    await element.updateComplete;

    const slotted = element.querySelector(".slot-text");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent).toBe("Extra content");
  });

  it("applies contentAlignment class to the panel container", async () => {
    element.contentAlignment = "content-end";
    await element.updateComplete;

    const container = element.shadowRoot?.querySelector(".container");
    expect(container?.classList.contains("content-end")).toBe(true);
  });

  it("renders footer slot content instead of fallback text", async () => {
    element.innerHTML = `
      <div slot="footer-ctalinks" class="footer-cta">Footer CTA</div>
      <div slot="footer-buttons" class="footer-btn">Footer Button</div>
    `;
    await element.updateComplete;

    const ctaSlot = element.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='footer-ctalinks']");
    const buttonSlot = element.shadowRoot?.querySelector<HTMLSlotElement>("slot[name='footer-buttons']");

    expect(ctaSlot).toBeTruthy();
    expect(buttonSlot).toBeTruthy();
    expect(ctaSlot?.assignedNodes().some((node) => node.textContent?.trim() === "Footer CTA")).toBe(true);
    expect(buttonSlot?.assignedNodes().some((node) => node.textContent?.trim() === "Footer Button")).toBe(true);
  });

  it("uses background-image and hides the inline img when variant is promo", async () => {
    element.variant = "promo";
    element.imageUrl = "https://example.com/promo.png";

    await element.updateComplete;

    const container = element.shadowRoot?.querySelector(".container");
    const image = element.shadowRoot?.querySelector("img.panel-image");
    const fallback = element.shadowRoot?.querySelector(".panel-image");

    expect(container?.getAttribute("style")).toContain("background-image:url(https://example.com/promo.png)");
    expect(image).toBeFalsy();
    expect(fallback).toBeTruthy();
  });
});
