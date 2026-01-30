import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-callout";
import type { QGDSCallout } from "./qgds-callout";

describe("qgds-callout", () => {
  let element: QGDSCallout;

  beforeEach(() => {
    element = document.createElement("qgds-callout");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;

    // Verify default property values
    expect(element.heading).toBe("Callout heading");
    expect(element.headingLevel).toBe("h3");
  });

  it("renders HTML passed to the slot", async () => {
    // Add HTML content to the slot
    element.innerHTML =
      '<p class="test-slot">Slot <strong>content</strong></p>';
    await element.updateComplete;

    // Query the slotted content in the light DOM
    const slotted = element.querySelector(".test-slot");
    expect(slotted).not.toBeNull();
    expect(slotted?.innerHTML).toContain("<strong>content</strong>");
    expect(slotted?.textContent).toBe("Slot content");
  });
});
