import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./qgds-global-alert";
import type { QGDSGlobalAlert } from "./qgds-global-alert";

describe("qgds-global-alert", () => {
  let element: QGDSGlobalAlert;

  beforeEach(() => {
    element = document.createElement("qgds-global-alert");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    await element.updateComplete;

    expect(element.variant).toBe("warning");
    expect(element.isDismissible).toBe(false);
    expect(element.heading).toBeUndefined();
    expect(element.actionLabel).toBeUndefined();
    expect(element.actionHref).toBeUndefined();
  });

  it("renders the correct variant class", async () => {
    element.variant = "critical";
    await element.updateComplete;

    const alert = element.shadowRoot?.querySelector(".global-alert");
    expect(alert?.classList.contains("is-critical")).toBe(true);
  });

  it("renders all three variants without error", async () => {
    for (const variant of ["critical", "warning", "general"] as const) {
      element.variant = variant;
      await element.updateComplete;

      const alert = element.shadowRoot?.querySelector(".global-alert");
      expect(alert?.classList.contains(`is-${variant}`)).toBe(true);
    }
  });

  it("renders the correct aria-label for each variant", async () => {
    const expected = {
      critical: "Alert",
      warning: "Warning",
      general: "Information",
    };

    for (const [variant, label] of Object.entries(expected)) {
      element.variant = variant as QGDSGlobalAlert["variant"];
      await element.updateComplete;

      const alert = element.shadowRoot?.querySelector(".global-alert");
      expect(alert?.getAttribute("aria-label")).toBe(label);
    }
  });

  it("renders the correct aria-role for each variant", async () => {
    const expected = {
      critical: "alert",
      warning: "status",
      general: "status",
    };

    for (const [variant, role] of Object.entries(expected)) {
      element.variant = variant as QGDSGlobalAlert["variant"];
      await element.updateComplete;

      const alert = element.shadowRoot?.querySelector(".global-alert");
      expect(alert?.getAttribute("role")).toBe(role);
    }
  });

  it("renders the heading when set", async () => {
    element.heading = "Site notice";
    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".heading");
    expect(heading?.textContent?.trim()).toBe("Site notice:");
  });

  it("does not render visible heading text when heading is not set", async () => {
    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".heading");
    expect(heading).toBeNull();
  });

  it("renders slotted message content", async () => {
    element.innerHTML = "<strong>Testing:</strong> This is a test message";
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector("slot");
    const assigned = slot?.assignedNodes({ flatten: true });
    expect(assigned?.length).toBeGreaterThan(0);
  });

  it("renders an action link when actionLabel and actionHref are set", async () => {
    element.actionLabel = "Learn more";
    element.actionHref = "https://example.com";
    await element.updateComplete;

    const action = element.shadowRoot?.querySelector("qgds-call-to-action");
    expect(action).not.toBeNull();
    expect(action?.getAttribute("href")).toBe("https://example.com");
    expect(action?.getAttribute("label")).toBe("Learn more");
  });

  it("does not render an action link when actionLabel or actionHref is missing", async () => {
    element.actionLabel = "Learn more";
    // actionHref intentionally omitted
    await element.updateComplete;

    const action = element.shadowRoot?.querySelector(".action");
    expect(action).toBeNull();
  });

  it("renders a dismiss button when isDismissible is true", async () => {
    element.isDismissible = true;
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector("button.close");
    expect(button).not.toBeNull();
    expect(button?.getAttribute("aria-label")).toBe("Close alert");
  });

  it("does not render a dismiss button when isDismissible is false", async () => {
    element.isDismissible = false;
    await element.updateComplete;

    const button = element.shadowRoot?.querySelector("button.close");
    expect(button).toBeNull();
  });

  it("removes the alert and fires qgds-global-alert-dismiss when dismiss button is clicked", async () => {
    element.isDismissible = true;
    await element.updateComplete;

    const dismissHandler = vi.fn();
    element.addEventListener("qgds-global-alert-dismiss", dismissHandler);

    const button = element.shadowRoot?.querySelector<HTMLButtonElement>("button.close");
    button?.click();
    await element.updateComplete;

    expect(dismissHandler).toHaveBeenCalledOnce();
    expect(element.isDismissed).toBe(true);
    expect(element.isConnected).toBe(false);
  });

  it("does not remove the alert when dismiss event default is prevented", async () => {
    element.isDismissible = true;
    await element.updateComplete;

    element.addEventListener("qgds-global-alert-dismiss", (e) => {
      e.preventDefault();
    });

    const button = element.shadowRoot?.querySelector<HTMLButtonElement>("button");
    button?.click();
    await element.updateComplete;

    expect(element.isDismissed).toBe(false);
    expect(element.isConnected).toBe(true);
    expect(element.shadowRoot?.querySelector(".global-alert")).not.toBeNull();
  });
});
