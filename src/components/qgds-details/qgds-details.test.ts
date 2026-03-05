import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-details";
import type { QGDSDetails } from "./qgds-details";

describe("qgds-details", () => {
  let element: QGDSDetails;

  beforeEach(() => {
    element = document.createElement("qgds-details") as QGDSDetails;
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
    window.dataLayer = [];

    const wrapper = document.createElement("div");
    element.id = "details-1";
    element.setAttribute("name", "faq-panel");
    wrapper.appendChild(element);
    document.body.appendChild(wrapper);

    await element.updateComplete;

    const qgdsToggleDetails: {
      open: boolean;
      component: string;
      id: string | null;
      name: string | null;
      source: string;
      originalEvent: Event;
    }[] = [];

    wrapper.addEventListener("qgds-toggle", (event: Event) => {
      const customEvent = event as CustomEvent<{
        open: boolean;
        component: string;
        id: string | null;
        name: string | null;
        source: string;
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

    expect(qgdsToggleDetails.map((detail) => detail.open)).toEqual([true, false]);
    expect(qgdsToggleDetails[0]?.component).toBe("qgds-details");
    expect(qgdsToggleDetails[0]?.id).toBe("details-1");
    expect(qgdsToggleDetails[0]?.name).toBe("faq-panel");
    expect(qgdsToggleDetails[0]?.source).toBe("summary");
    expect(qgdsToggleDetails[0]?.originalEvent).toBeInstanceOf(Event);
    expect(window.dataLayer.length).toBe(2);
    expect(window.dataLayer[0]?.event).toBe("qgds-toggle");
    expect(window.dataLayer[0]?.open).toBe(true);
    expect(window.dataLayer[0]?.component).toBe("qgds-details");
    expect(window.dataLayer[0]?.originalEvent).toBe("toggle");

    wrapper.remove();
  });
});
