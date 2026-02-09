import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-inpage-alert";
import type { QGDSInpageAlert } from "./qgds-inpage-alert";

describe("qgds-inpage-alert", () => {
  let element: QGDSInpageAlert;

  beforeEach(() => {
    element = document.createElement("qgds-inpage-alert");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;

    // Verify default property values
    expect(element.heading).toBe(undefined);
    expect(element.variant).toBe("info");

    // Verify the heading is not rendered
    const headingElement = element.shadowRoot?.querySelector(
      ".content-wrapper > .heading",
    );
    expect(headingElement).toBe(null);

    // Verify the slot is empty
    const slot = element.shadowRoot?.querySelector("slot");
    const assignedElements = slot?.assignedElements();
    expect(assignedElements?.length).toBe(0);
  });

  it("Should render content as expected.", async () => {
    const headingText = "Here is the heading";
    element.heading = headingText;

    // InnerHTML should be forwarded to the slotted content.
    element.innerHTML = "<p>Here is the slotted content</p>";

    await element.updateComplete;

    // Verify the heading is rendered
    const headingElement = element.shadowRoot?.querySelector(
      ".content-wrapper > .heading",
    );
    expect(headingElement?.outerHTML).toBe(
      `<h3 class="heading qgds-display-lg">${headingText}</h3>`,
    );

    // Verify the slot is distributing the content correctly
    const slot = element.shadowRoot?.querySelector("slot");
    const assignedElements = slot?.assignedElements();
    expect(assignedElements?.length).toBe(1);
    expect(assignedElements?.[0].tagName).toBe("P");
    expect(assignedElements?.[0].textContent).toBe(
      "Here is the slotted content",
    );
  });
});
