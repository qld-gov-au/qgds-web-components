import { describe, it, expect, beforeEach, afterEach } from "vitest";

import "./qgds-attribution-bar";
import type { QGDSAttributionBar } from "./qgds-attribution-bar";

describe("qgds-attribution-bar", () => {
  let element: QGDSAttributionBar;

  beforeEach(async () => {
    element = document.createElement("qgds-attribution-bar");

    document.body.appendChild(element);

    await element.updateComplete;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("registers the custom element", () => {
    expect(customElements.get("qgds-attribution-bar")).toBeDefined();
  });

  it("renders the attribution bar container", () => {
    const container = element.shadowRoot?.querySelector(".attribution-bar");

    expect(container).not.toBeNull();
    expect(container?.getAttribute("aria-label")).toBe("Attribution bar");
  });

  it("renders all sections", () => {
    expect(element.shadowRoot?.querySelector(".attribution-bar-collection")).not.toBeNull();

    expect(element.shadowRoot?.querySelector(".attribution-bar-links")).not.toBeNull();
  });

  it("renders the expected slot", () => {
    const slots = element.shadowRoot?.querySelectorAll("slot");

    expect(slots).toHaveLength(1);
    expect(slots?.[0].name).toBe("");
  });

  // If passed both url and label, the link should be rendered. If either is missing, the link should not be rendered.
  it("renders href and label when both url and label are provided", async () => {
    element.url = "https://www.qld.gov.au";
    element.label = "qld.gov.au";

    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");

    expect(link?.getAttribute("href")).toBe("https://www.qld.gov.au");
    expect(link?.getAttribute("label")).toBe("qld.gov.au");
  });

  it("projects content into the default slot", async () => {
    element.innerHTML = `
      <qgds-link id="contact-link">Contact us</qgds-link>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("#contact-link");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent).toBe("Contact us");
  });

  it("projects custom content into the default slot", async () => {
    element.innerHTML = `
      <div>
        Custom Content
      </div>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("div");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent.trim()).toBe("Custom Content");
  });
});
