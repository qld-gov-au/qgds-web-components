import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-blockquote";
import type { QGDSBlockquote } from "./qgds-blockquote";

describe("qgds-blockquote", () => {
  let element: QGDSBlockquote;

  beforeEach(() => {
    element = document.createElement("qgds-blockquote");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders custom reference url and text", async () => {
    element.setAttribute(
      "reference-url",
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote#attributes"
    );
    element.setAttribute("reference-text", "Sir Tim Berners-Lee");
    await element.updateComplete;

    expect(element.referenceURL).toBe(
      "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote#attributes"
    );
    expect(element.referenceText).toBe("Sir Tim Berners-Lee");
  });

  it("renders HTML passed to the slot", async () => {
    // Add HTML content to the slot
    element.innerHTML = '<p class="test-slot">Slot <strong>content</strong></p>';
    await element.updateComplete;

    // Query the slotted content in the light DOM
    const slotted = element.querySelector(".test-slot");
    expect(slotted).not.toBeNull();
    expect(slotted?.innerHTML).toContain("<strong>content</strong>");
    expect(slotted?.textContent).toBe("Slot content");
  });
});
