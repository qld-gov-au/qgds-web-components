import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { QGDSDetails } from "./qgds-details";
import "./qgds-details";

describe("qgds-details", () => {
  let element: QGDSDetails;

  beforeEach(() => {
    element = document.createElement("qgds-details");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders defaults", async () => {
    await element.updateComplete;

    expect(element.summaryText).toBe("Summary");
    expect(element.size).toBe("sm");

    const details = element.shadowRoot?.querySelector("details");
    expect(details).toBeTruthy();
  });

  it("dispatches qgds-toggle with metadata on open/close", async () => {
    const wrapper = document.createElement("div");
    element.id = "details-1";
    wrapper.appendChild(element);
    document.body.appendChild(wrapper);

    await element.updateComplete;

    const qgdsToggleDetails: {
      open: boolean;
      id: string | null;
    }[] = [];

    wrapper.addEventListener("qgds-toggle", (event: Event) => {
      const customEvent = event as CustomEvent<{
        open: boolean;
        id: string | null;
      }>;
      qgdsToggleDetails.push(customEvent.detail);
    });

    const details = element.shadowRoot?.querySelector("details");
    expect(details).toBeTruthy();

    if (details) {
      // Manually trigger toggle events to test event handling
      details.open = true;
      details.dispatchEvent(new Event("toggle", { bubbles: true, composed: true }));
      await element.updateComplete;

      details.open = false;
      details.dispatchEvent(new Event("toggle", { bubbles: true, composed: true }));
      await element.updateComplete;
    }

    expect(qgdsToggleDetails.map((detail) => detail.open)).toEqual([true, false]);
    expect(qgdsToggleDetails[0]?.id).toBe("details-1");

    wrapper.remove();
  });

  it("renders custom summary text", async () => {
    element.summaryText = "Click to expand";
    await element.updateComplete;

    const summaryText = element.shadowRoot?.querySelector("summary .text");
    expect(summaryText?.textContent).toBe("Click to expand");
  });

  it("applies size variants correctly", async () => {
    const summary = element.shadowRoot?.querySelector("summary div");
    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(summary).toBeTruthy();
    expect(icon).toBeTruthy();

    // Helper to get the --font-size CSS custom property value
    const getFontSizeVar = () => {
      const styles = getComputedStyle(element);
      return styles.getPropertyValue("--font-size").trim();
    };

    // Test sm (default)
    element.size = "sm";
    await element.updateComplete;
    expect(getFontSizeVar()).toBe("0.875rem");
    expect(icon?.getAttribute("size")).toBe("sm"); // Icon stays sm

    // Test md
    element.size = "md";
    await element.updateComplete;
    expect(getFontSizeVar()).toBe("1rem");
    expect(icon?.getAttribute("size")).toBe("sm");

    // Test lg
    element.size = "lg";
    await element.updateComplete;
    expect(getFontSizeVar()).toBe("1.25rem");
    expect(icon?.getAttribute("size")).toBe("sm");

    // Test xl
    element.size = "xl";
    await element.updateComplete;
    expect(getFontSizeVar()).toBe("1.5rem");
    expect(icon?.getAttribute("size")).toBe("sm");

    // Verify font-size is actually applied to summary text
    if (summary) {
      expect(getComputedStyle(summary).fontSize).not.toBe("");
    }
  });

  it("renders chevron icon", async () => {
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("icon-id")).toBe("chevron-right");
    expect(icon?.getAttribute("size")).toBe("sm");
  });

  it("applies aria-label when provided", async () => {
    element.ariaLabel = "Custom disclosure label";
    await element.updateComplete;

    const summary = element.shadowRoot?.querySelector("summary");
    expect(summary?.getAttribute("aria-label")).toBe("Custom disclosure label");
  });

  it("does not apply aria-label when null", async () => {
    element.ariaLabel = null;
    await element.updateComplete;

    const summary = element.shadowRoot?.querySelector("summary");
    expect(summary?.hasAttribute("aria-label")).toBe(false);
  });

  it("toggles details element open state", async () => {
    await element.updateComplete;

    const details = element.shadowRoot?.querySelector("details");
    const summary = element.shadowRoot?.querySelector("summary");
    expect(details).toBeTruthy();
    expect(summary).toBeTruthy();

    if (details && summary) {
      // Initially closed
      expect(details.open).toBe(false);

      // Click summary to open details
      summary.click();
      await element.updateComplete;

      expect(details.open).toBe(true);

      // Click summary again to close details
      summary.click();
      await element.updateComplete;

      expect(details.open).toBe(false);
    }
  });

  it("renders slotted content", async () => {
    element.innerHTML = "<p>This is slotted content</p>";
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector("slot");
    expect(slot).toBeTruthy();

    const assignedNodes = slot?.assignedNodes();
    expect(assignedNodes?.length).toBeGreaterThan(0);
  });

  it("dispatches event without id when no id is set", async () => {
    await element.updateComplete;

    const eventDetails: { open: boolean; id: string | null }[] = [];

    element.addEventListener("qgds-toggle", (event: Event) => {
      const customEvent = event as CustomEvent<{
        open: boolean;
        id: string | null;
      }>;
      eventDetails.push(customEvent.detail);
    });

    const details = element.shadowRoot?.querySelector("details");
    expect(details).toBeTruthy();

    if (details) {
      // Manually trigger toggle event to test event handling
      details.open = true;
      details.dispatchEvent(new Event("toggle", { bubbles: true, composed: true }));
      await element.updateComplete;
    }

    expect(eventDetails.length).toBe(1);
    expect(eventDetails[0]?.id).toBeNull();
    expect(eventDetails[0]?.open).toBe(true);
  });
});
