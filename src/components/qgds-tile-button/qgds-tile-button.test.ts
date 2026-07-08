import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-tile-button";
import type { QGDSTileButton } from "./qgds-tile-button";

describe("qgds-tile-button", () => {
  let element: QGDSTileButton;

  beforeEach(() => {
    element = document.createElement("qgds-tile-button");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBe("");
  });

  it("renders a button with the correct label and icon", async () => {
    element.label = "Tile Button";
    element.iconName = "design";

    await element.updateComplete;

    const button = element.shadowRoot?.querySelector(".qgds-tile-button");
    const icon = button?.querySelector("qgds-icon");

    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe("Tile Button");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("icon-id")).toBe("design");
  });

  it("renders a link when href is provided", async () => {
    element.label = "Tile Button Link";
    element.iconName = "design";
    element.href = "/pathhere";

    await element.updateComplete;

    const link = element.shadowRoot?.querySelector(".qgds-tile-button");
    const icon = link?.querySelector("qgds-icon");

    expect(link).toBeTruthy();
    expect(link?.tagName.toLowerCase()).toBe("a");
    expect(link?.getAttribute("href")).toBe("/pathhere");
    expect(link?.textContent?.trim()).toBe("Tile Button Link");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("icon-id")).toBe("design");
  });

  it("dispatches qgds-click event on button click with the correct detail", () => {
    const listener = vi.fn();

    element.addEventListener("qgds-click", listener);

    const button = element.shadowRoot?.querySelector("button");
    expect(button).toBeTruthy();

    button?.click();

    expect(listener).toHaveBeenCalledTimes(1);

    const event = listener.mock.calls[0][0] as CustomEvent;
    const detail = event.detail as {
      component: string;
      componentID: string | null;
      originalEvent?: Event;
      timestamp: number;
    };

    expect(event.type).toBe("qgds-click");
    expect(detail.component).toBe("qgds-tile-button");
    expect(detail.componentID).toBeNull();
    expect(detail.originalEvent).toBeInstanceOf(MouseEvent);
    expect(detail.timestamp).toEqual(expect.any(Number));
  });
});
