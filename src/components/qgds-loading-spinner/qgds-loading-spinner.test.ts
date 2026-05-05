import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-loading-spinner";
import type { QGDSLoadingSpinner } from "./qgds-loading-spinner";

describe("qgds-loading-spinner", () => {
  let element: QGDSLoadingSpinner;

  beforeEach(() => {
    element = document.createElement("qgds-loading-spinner");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.size).toBe("md");
    expect(element.label).toBe("Loading");
    expect(element.labelVisible).toBe(false);
    expect(element.stacked).toBe(false);
  });

  it("renders the status role for accessibility", async () => {
    await element.updateComplete;

    const status = element.shadowRoot?.querySelector("[role='status']");
    expect(status).not.toBeNull();
  });

  it("sets aria-label on the status container", async () => {
    element.label = "Saving your changes";
    await element.updateComplete;

    const status = element.shadowRoot?.querySelector("[role='status']");
    expect(status?.getAttribute("aria-label")).toBe("Saving your changes");
  });

  it("renders a qgds-icon with spinner-step-1", async () => {
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(icon).not.toBeNull();
    expect(icon?.getAttribute("icon-id")).toBe("spinner-step-1");
  });

  it("passes the size prop to qgds-icon", async () => {
    element.size = "lg";
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(icon?.getAttribute("size")).toBe("lg");
  });

  it("sets aria-hidden on the icon", async () => {
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
  });

  it("hides label visually when labelVisible is false", async () => {
    await element.updateComplete;

    const srOnly = element.shadowRoot?.querySelector(".sr-only");
    const visibleLabel = element.shadowRoot?.querySelector(".label");

    expect(srOnly).not.toBeNull();
    expect(visibleLabel).toBeNull();
  });

  it("shows label visually when labelVisible is true", async () => {
    element.labelVisible = true;
    await element.updateComplete;

    const visibleLabel = element.shadowRoot?.querySelector(".label");
    const srOnly = element.shadowRoot?.querySelector(".sr-only");

    expect(visibleLabel).not.toBeNull();
    expect(visibleLabel?.textContent?.trim()).toBe("Loading");
    expect(srOnly).toBeNull();
  });

  it("reflects labelVisible as attribute", async () => {
    element.labelVisible = true;
    await element.updateComplete;

    expect(element.hasAttribute("label-visible")).toBe(true);
  });

  it("updates visible label text when label changes", async () => {
    element.labelVisible = true;
    element.label = "Please wait";
    await element.updateComplete;

    const visibleLabel = element.shadowRoot?.querySelector(".label");
    expect(visibleLabel?.textContent?.trim()).toBe("Please wait");
  });

  it("does not add is-stacked class by default", async () => {
    await element.updateComplete;

    const spinner = element.shadowRoot?.querySelector(".loading-spinner");
    expect(spinner?.classList.contains("is-stacked")).toBe(false);
  });

  it("adds is-stacked class when stacked is true", async () => {
    element.stacked = true;
    await element.updateComplete;

    const spinner = element.shadowRoot?.querySelector(".loading-spinner");
    expect(spinner?.classList.contains("is-stacked")).toBe(true);
  });

  it("reflects stacked as attribute", async () => {
    element.stacked = true;
    await element.updateComplete;

    expect(element.hasAttribute("stacked")).toBe(true);
  });
});
