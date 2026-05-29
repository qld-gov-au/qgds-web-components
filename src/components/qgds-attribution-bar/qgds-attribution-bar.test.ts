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
    expect(element.shadowRoot?.querySelector(".attribution-bar__collection")).not.toBeNull();

    expect(element.shadowRoot?.querySelector(".attribution-bar__attribution")).not.toBeNull();

    expect(element.shadowRoot?.querySelector(".attribution-bar__custom")).not.toBeNull();
  });

  it("renders the expected slots", () => {
    const slots = element.shadowRoot?.querySelectorAll("slot");

    expect(slots).toHaveLength(3);

    expect(slots?.[0].name).toBe("");
    expect(slots?.[1].name).toBe("attribution");
    expect(slots?.[2].name).toBe("custom");
  });

  it("projects content into the default slot", async () => {
    element.innerHTML = `
      <qgds-link id="collection-link">Collection</qgds-link>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("#collection-link");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent).toBe("Collection");
  });

  it("projects content into the attribution slot", async () => {
    element.innerHTML = `
      <qgds-link slot="attribution" id="contact-link">Contact us</qgds-link>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("#contact-link");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent).toBe("Contact us");
  });

  it("projects content into the custom slot", async () => {
    element.innerHTML = `
      <qgds-custom-html slot="custom">
        Custom Content
      </qgds-custom-html>
    `;

    await element.updateComplete;

    const slotted = element.querySelector("qgds-custom-html");
    expect(slotted).not.toBeNull();
    expect(slotted?.textContent.trim()).toBe("Custom Content");
  });
});
