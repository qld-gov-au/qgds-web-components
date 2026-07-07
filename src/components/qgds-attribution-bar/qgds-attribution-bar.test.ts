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

  it("renders the expected slots", () => {
    const slots = element.shadowRoot?.querySelectorAll("slot");

    expect(slots).toHaveLength(2);

    expect(slots?.[0].name).toBe("site-name");
    expect(slots?.[1].name).toBe("");
  });

  it("projects content into the site-name slot", async () => {
    element.innerHTML = `
      <qgds-link slot="site-name" id="collection-link">Collection</qgds-link>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("#collection-link");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent).toBe("Collection");
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
