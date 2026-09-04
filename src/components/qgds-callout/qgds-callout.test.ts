import { describe, it, expect, beforeEach, afterAll } from "vitest";
import "./qgds-callout";
import type { QGDSCallout } from "./qgds-callout";

describe("qgds-callout", () => {
  let element: QGDSCallout;

  const setupCallout = (params: Partial<QGDSCallout> = {}) => {
    element?.remove();
    element = Object.assign(document.createElement("qgds-callout"), params);
    document.body.appendChild(element);
  };

  beforeEach(() => setupCallout());

  afterAll(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;

    // Verify default property values
    expect(element.heading).toBe(undefined);
    expect(element.headingLevel).toBe("h3");
    expect(element.headingSize).toBe(undefined);
  });

  it("does not render a heading if heading property is not passed", async () => {
    await element.updateComplete;
    const headingElement = element.shadowRoot?.querySelector(".heading");
    expect(headingElement).toBeNull();
  });

  it("renders heading as a h3 tag by default", async () => {
    const headingText = "My heading";
    element.heading = headingText;
    await element.updateComplete;

    const headingElement = element.shadowRoot?.querySelector(".heading");
    expect(headingElement?.nodeName).toBe("H3");
    expect(headingElement?.textContent).toBe(headingText);
  });

  it("renders heading tag as defined by headingLevel property", async () => {
    element.heading = "My heading";
    element.headingLevel = "h5";
    await element.updateComplete;

    const headingElement = element.shadowRoot?.querySelector(".heading");
    expect(headingElement?.nodeName).toBe("H5");
  });

  it("applies CSS class based on headingLevel, and overrides with headingSize property", async () => {
    element.heading = "My heading";
    await element.updateComplete;

    let headingElement = element.shadowRoot?.querySelector(".heading");
    expect(headingElement?.classList).toContain("qgds-heading-sm");

    element.headingLevel = "h2";
    await element.updateComplete;
    headingElement = element.shadowRoot?.querySelector(".heading");
    expect(headingElement?.classList).toContain("qgds-heading-md");

    element.headingSize = "xs";
    await element.updateComplete;
    expect(headingElement?.classList).toContain("qgds-heading-xs");
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

  describe("Accessibility:", () => {
    it("has has a role of 'note'", async () => {
      await element.updateComplete;
      expect(element.role).toBe("note");
      expect(element.getAttribute("role")).toBe("note");
    });

    it("Allows role to be customised", async () => {
      setupCallout({ role: "A custom role" });
      await element.updateComplete;

      expect(element.role).toBe("A custom role");
      expect(element.getAttribute("role")).toBe("A custom role");
    });

    it("assigns heading property to ariaLabel by default", async () => {
      setupCallout({ heading: "Custom heading" });
      await element.updateComplete;

      expect(element.ariaLabel).toBe("Custom heading");
    });

    it("Honors ariaLabel rather using heading property, if ariaLabel is provided", async () => {
      setupCallout({ heading: "Custom heading", ariaLabel: "A real aria label" });
      await element.updateComplete;

      expect(element.ariaLabel).toBe("A real aria label");
    });
  });
});
