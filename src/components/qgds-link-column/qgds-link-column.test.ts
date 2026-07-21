import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-link-column";
import "../qgds-link-item/qgds-link-item";
import "../qgds-call-to-action/qgds-call-to-action";
import type { QGDSLinkColumn } from "./qgds-link-column";

describe("qgds-link-column", () => {
  let element: QGDSLinkColumn;

  beforeEach(() => {
    element = document.createElement("qgds-link-column");
    element.setAttribute("aria-label", "test label");
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.direction).toBe("vertical");
    expect(element.columns).toBe(1);
  });

  it("aria-label persists on the main component", async () => {
    element.setAttribute("aria-label", "Quick links");
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.getAttribute("aria-label")).toBe("Quick links");
    expect(element.ariaLabel).toBe("Quick links");
  });

  it("falls back to 'Related links' for aria-label when aria-label is undefined", async () => {
    element.removeAttribute("aria-label");
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element.getAttribute("aria-label")).toBe("Related links");
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
    element.removeAttribute("aria-label");
    document.body.appendChild(element);
    await element.updateComplete;

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No "aria-label"'));
    warnSpy.mockRestore();
  });
});
