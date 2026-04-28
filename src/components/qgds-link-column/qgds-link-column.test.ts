import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-link-column";
import "../qgds-link-item/qgds-link-item";
import "../qgds-call-to-action/qgds-call-to-action";
import type { QgdsLinkColumn } from "./qgds-link-column";

describe("qgds-link-column", () => {
  let element: QgdsLinkColumn;

  beforeEach(() => {
    element = document.createElement("qgds-link-column");
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.heading).toBe("");
    expect(element.headingLevel).toBe(3);
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

  it("renders heading when heading attribute is set", async () => {
    element.setAttribute("heading", "Our services");
    document.body.appendChild(element);
    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".heading");
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toContain("Our services");
  });

  it("does not render heading element when heading is empty", async () => {
    element.setAttribute("aria-label", "Services navigation");
    document.body.appendChild(element);
    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".heading");
    expect(heading).toBeFalsy();
  });

  it("uses aria-label on the nav element", async () => {
    element.setAttribute("aria-label", "Quick links");
    document.body.appendChild(element);
    await element.updateComplete;

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Quick links");
  });

  it("falls back to heading for nav aria-label when aria-label is absent", async () => {
    element.setAttribute("heading", "Our services");
    document.body.appendChild(element);
    await element.updateComplete;

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Our services");
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

  it("warns when no heading or aria-label is provided", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    document.body.appendChild(element);
    await element.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No "heading" or "aria-label"'));
    warnSpy.mockRestore();
  });

  describe("heading-level attribute suppression", () => {
    it("removes heading-level attribute when heading is empty (default)", async () => {
      element.setAttribute("aria-label", "Services");
      element.setAttribute("heading-level", "3");
      document.body.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(false);
    });

    it("keeps heading-level attribute when heading is set", async () => {
      element.setAttribute("heading", "Our services");
      element.setAttribute("heading-level", "2");
      document.body.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(true);
      expect(element.getAttribute("heading-level")).toBe("2");
    });

    it("preserves headingLevel property value when heading-level attribute is suppressed", async () => {
      element.setAttribute("aria-label", "Services");
      element.setAttribute("heading-level", "2");
      document.body.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(false);
      expect(element.headingLevel).toBe(2);
    });

    it("restores heading-level attribute when heading is set after being empty", async () => {
      element.setAttribute("aria-label", "Services");
      document.body.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(false);

      element.setAttribute("heading", "Our services");
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(true);
      expect(element.getAttribute("heading-level")).toBe("3");
    });

    it("removes heading-level attribute when heading is cleared", async () => {
      element.setAttribute("heading", "Our services");
      element.setAttribute("heading-level", "2");
      document.body.appendChild(element);
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(true);

      element.removeAttribute("heading");
      await element.updateComplete;

      expect(element.hasAttribute("heading-level")).toBe(false);
    });
  });
});
