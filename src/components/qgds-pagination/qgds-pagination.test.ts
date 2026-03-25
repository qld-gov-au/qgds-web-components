import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-pagination";
import type { QGDSPagination } from "./qgds-pagination";

describe("qgds-pagination", () => {
  let element: QGDSPagination;

  beforeEach(() => {
    element = document.createElement("qgds-pagination");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders defaults", async () => {
    await element.updateComplete;

    expect(element.currentPage).toBe(1);
    expect(element.totalPages).toBe(1);

    const nav = element.shadowRoot?.querySelector("nav");
    const liveRegion = element.shadowRoot?.querySelector(".sr-only[aria-live='polite']");

    expect(nav).toBeTruthy();
    expect(nav?.getAttribute("aria-label")).toBe(element.navAriaLabel);
    expect(liveRegion?.textContent?.trim()).toBe("Page 1 of 1");
  });

  it("renders previous link as disabled when on first page and show-prev-next is always", async () => {
    element.setAttribute("show-prev-next", "always");
    element.setAttribute("current-page", "1");
    element.setAttribute("total-pages", "5");

    await element.updateComplete;

    const prevLink = element.shadowRoot?.querySelector<HTMLAnchorElement>("a.prev-link");
    expect(prevLink).toBeTruthy();
    expect(prevLink?.getAttribute("aria-disabled")).toBe("true");
  });

  it("does not update currentPage when qgds-navigate is cancelled", async () => {
    element.setAttribute("current-page", "2");
    element.setAttribute("total-pages", "5");
    element.setAttribute("link-base", "/page/");

    await element.updateComplete;

    const handler = vi.fn((event: Event) => {
      event.preventDefault();
    });
    element.addEventListener("qgds-navigate", handler);

    const targetLink = element.shadowRoot?.querySelector<HTMLAnchorElement>("a.page-link[href='/page/3']");
    expect(targetLink).toBeTruthy();

    targetLink?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    const customEvent = handler.mock.calls[0]?.[0] as CustomEvent<{
      action: "prev" | "next" | "page";
      requestedPage: number | null;
      currentPage: number;
      totalPages: number;
      href: string;
    }>;

    expect(customEvent.detail.action).toBe("page");
    expect(customEvent.detail.requestedPage).toBe(3);
    expect(customEvent.detail.currentPage).toBe(2);
    expect(customEvent.detail.totalPages).toBe(5);
    expect(element.currentPage).toBe(2);
  });

  it("updates currentPage when qgds-navigate is not cancelled", async () => {
    element.setAttribute("current-page", "2");
    element.setAttribute("total-pages", "5");
    element.setAttribute("link-base", "/page/");

    await element.updateComplete;

    const handler = vi.fn();
    element.addEventListener("qgds-navigate", handler);

    const targetLink = element.shadowRoot?.querySelector<HTMLAnchorElement>("a.page-link[href='/page/3']");
    expect(targetLink).toBeTruthy();

    // Stop browser navigation in the test runner while still allowing qgds-navigate to proceed uncancelled.
    targetLink?.addEventListener("click", (event: Event) => event.preventDefault(), { capture: true });

    targetLink?.click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(element.currentPage).toBe(3);
  });
});
