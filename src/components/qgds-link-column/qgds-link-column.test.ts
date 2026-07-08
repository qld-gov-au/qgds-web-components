import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-link-column";
import "../qgds-link-item/qgds-link-item";
import "../qgds-call-to-action/qgds-call-to-action";
import type { QGDSLinkColumn } from "./qgds-link-column";

describe("qgds-link-column", () => {
  let element: QGDSLinkColumn;

  beforeEach(() => {
    element = document.createElement("qgds-link-column");
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.direction).toBe("vertical");
    expect(element.columns).toBe(1);
    expect(element.viewAllLabel).toBe("View all services");
    expect(element.viewAllURL).toBe("#");
  });

  it("renders a <nav> element", async () => {
    element.setAttribute("aria-label", "Test nav");
    document.body.appendChild(element);
    await element.updateComplete;

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav).toBeTruthy();
  });

  it("uses aria-label on the nav element", async () => {
    element.setAttribute("aria-label", "Quick links");
    document.body.appendChild(element);
    await element.updateComplete;

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Quick links");
  });

  it("falls back to 'Navigation' for nav aria-label when aria-label is absent", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Navigation");
  });

  it("renders qgds-call-to-action when view-all-url is set", async () => {
    element.setAttribute("view-all-url", "/services");
    element.setAttribute("aria-label", "Services");
    document.body.appendChild(element);
    await element.updateComplete;

    const cta = element.shadowRoot?.querySelector("qgds-call-to-action");
    expect(cta).toBeTruthy();
  });

  it("does not render qgds-call-to-action when view-all-url is empty", async () => {
    element.setAttribute("aria-label", "Services");
    document.body.appendChild(element);
    await element.updateComplete;

    const cta = element.shadowRoot?.querySelector("qgds-call-to-action");
    expect(cta).toBeFalsy();
  });

  it("clamps columns to a maximum of 3", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    element.columns = 10;
    expect(element.columns).toBe(3);
  });

  it("clamps columns to a minimum of 1", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    element.columns = 0;
    expect(element.columns).toBe(1);
  });

  it("warns when no aria-label is provided", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    document.body.appendChild(element);
    await element.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No "aria-label"'));
    warnSpy.mockRestore();
  });
});
