import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-icon";
import type { QGDSIcon } from "./qgds-icon";

describe("qgds-icon", () => {
  let element: QGDSIcon;

  beforeEach(() => {
    element = document.createElement("qgds-icon");
  });

  afterEach(() => {
    element.remove();
  });

  it("renders an icon when icon-id is provided", async () => {
    element.setAttribute("icon-id", "home");
    document.body.appendChild(element);
    await element.updateComplete;

    const iconSpan = element.shadowRoot?.querySelector("span.qgds-icon");
    expect(iconSpan).not.toBeNull();
  });

  it("applies the correct size class based on the size property", async () => {
    element.setAttribute("icon-id", "home");
    element.size = "lg";
    document.body.appendChild(element);
    await element.updateComplete;

    const iconSpan = element.shadowRoot?.querySelector("span.qgds-icon");
    expect(iconSpan).not.toBeNull();
    expect(iconSpan?.getAttribute("style")).toContain(
      "--_qgds-icon-size: var(--qgds-icon-size, var(--qgds-icon-size-lg))"
    );
  });

  it("sets role and aria-hidden attributes based on aria-label", async () => {
    element.setAttribute("icon-id", "home");
    element.ariaLabel = "Home Icon";
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element).not.toBeNull();
    expect(element.getAttribute("role")).toBe("img");
    expect(element.getAttribute("aria-hidden")).toBeNull();
  });

  it("sets aria-hidden to true when aria-label is not provided", async () => {
    element.setAttribute("icon-id", "home");
    document.body.appendChild(element);
    await element.updateComplete;

    expect(element).not.toBeNull();
    expect(element.getAttribute("aria-hidden")).toBe("true");
  });
});
