import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-side-navigation-item";
import type { QGDSSideNavigationItem } from "./qgds-side-navigation-item";

describe("qgds-side-navigation-item", () => {
  let element: QGDSSideNavigationItem;

  beforeEach(() => {
    element = document.createElement("qgds-side-navigation-item");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders a non-interactive label when no href is provided", async () => {
    element.label = "No link";
    await element.updateComplete;

    const span = element.shadowRoot?.querySelector("span.qgds-side-navigation-item");
    expect(span).not.toBeNull();
    expect(span?.textContent?.trim()).toBe("No link");
  });

  it("renders an anchor when href is provided and isActive is false", async () => {
    element.href = "/page";
    element.label = "Page";
    await element.updateComplete;

    const anchor = element.shadowRoot?.querySelector("a.qgds-side-navigation-item");
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute("href")).toBe("/page");
    expect(anchor?.textContent?.trim()).toBe("Page");
  });

  it("renders active items as a span even when href is provided", async () => {
    element.href = "/page";
    element.label = "Active page";
    element.isActive = true;
    await element.updateComplete;

    const anchor = element.shadowRoot?.querySelector("a.qgds-side-navigation-item");
    const span = element.shadowRoot?.querySelector("span.qgds-side-navigation-item");

    expect(anchor).toBeNull();
    expect(span).not.toBeNull();
    expect(span?.classList.contains("is-active")).toBe(true);
  });

  it("uses slotted text content as the label and detects nested child items", async () => {
    element.innerHTML = `Parent <qgds-side-navigation-item href="/child" label="Child"></qgds-side-navigation-item>`;
    await element.updateComplete;
    expect(element.label).toBe("Parent");
    expect(element?.level).toBe(1);

    const child = element.querySelector("qgds-side-navigation-item");
    try {
      await child?.updateComplete;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message); // Safe to access .message now
      } else {
        console.error("An unexpected error occurred", error);
      }
    }
    expect(child).not.toBeNull();
    expect(child?.level).toBe(2);

    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".qgds-side-navigation-list")).not.toBeNull();
  });
});
