import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-details";
import type { QGDSDetails } from "./qgds-details";

describe("qgds-details", () => {
  let element: QGDSDetails;

  beforeEach(() => {
    element = document.createElement("qgds-details");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    delete window.dataLayer;
  });

  it("renders defaults", async () => {
    await element.updateComplete;

    expect(element.summaryText).toBe("Summary");
    expect(element.size).toBe("md");

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
      component: string;
      componentID: string | null;
      id: string | null;
      timestamp: number;
      originalEvent: Event;
    }[] = [];

    wrapper.addEventListener("qgds-toggle", (event: Event) => {
      const customEvent = event as CustomEvent<{
        open: boolean;
        component: string;
        componentID: string | null;
        id: string | null;
        timestamp: number;
        originalEvent: Event;
      }>;
      qgdsToggleDetails.push(customEvent.detail);
    });

    const details = element.shadowRoot?.querySelector("details");
    expect(details).toBeTruthy();
    if (!details) {
      throw new Error("details element was not rendered");
    }

    details.open = true;
    details.dispatchEvent(new Event("toggle", { bubbles: true }));

    details.open = false;
    details.dispatchEvent(new Event("toggle", { bubbles: true }));

    expect(qgdsToggleDetails.map((detail) => detail.open)).toEqual([
      true,
      false,
    ]);
    expect(qgdsToggleDetails[0]?.component).toBe("qgds-details");
    expect(qgdsToggleDetails[0]?.componentID).toBe("details-1");
    expect(qgdsToggleDetails[0]?.id).toBe("details-1");
    expect(typeof qgdsToggleDetails[0]?.timestamp).toBe("number");
    expect(qgdsToggleDetails[0]?.originalEvent).toBeInstanceOf(Event);

    wrapper.remove();
  });
});
