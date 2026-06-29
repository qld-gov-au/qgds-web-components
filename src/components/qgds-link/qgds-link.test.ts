import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-link";
import type { QGDSLink } from "./qgds-link";

describe("qgds-link", () => {
  let element: QGDSLink;

  beforeEach(() => {
    element = document.createElement("qgds-link");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBe("");
    expect(element.href).toBe("");
    expect(element.isDisabled).toBe(false);
    expect(element.iconName).toBe("");
    expect(element.iconSize).toBe("md");
    expect(element.hasTrailingIcon).toBe(false);
    expect(element.stretch).toBe(false);
    expect(element.animation).toBeUndefined();
    expect(element.onlyIcon).toBe(false);
  });

  it("renders a <span> when no href is set", async () => {
    await element.updateComplete;

    const span = element.shadowRoot?.querySelector("span");
    const anchor = element.shadowRoot?.querySelector("a");

    expect(span).toBeTruthy();
    expect(anchor).toBeFalsy();
  });

  it("renders an <a> when href is provided", async () => {
    element.setAttribute("href", "#about");
    await element.updateComplete;

    const anchor = element.shadowRoot?.querySelector("a");

    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute("href")).toBe("#about");
  });

  it("renders the label text", async () => {
    element.setAttribute("label", "Go to services");
    element.setAttribute("href", "/services");
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain("Go to services");
  });

  it("dispatches qgds-click event when clicked", async () => {
    element.setAttribute("href", "#services");
    element.setAttribute("label", "Click me");
    await element.updateComplete;

    const events: CustomEvent[] = [];
    element.addEventListener("qgds-click", (e) => events.push(e as CustomEvent));

    const anchor = element.shadowRoot?.querySelector("a");
    anchor?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));

    expect(events).toHaveLength(1);
    expect(events[0].detail).toMatchObject({ href: "#services", label: "Click me" });
  });

  it("does not dispatch qgds-click when disabled", async () => {
    element.setAttribute("href", "#services");
    element.setAttribute("is-disabled", "");
    await element.updateComplete;

    const events: CustomEvent[] = [];
    element.addEventListener("qgds-click", (e) => events.push(e as CustomEvent));

    const anchor = element.shadowRoot?.querySelector("a");
    anchor?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));

    expect(events).toHaveLength(0);
  });

  it("renders label as screen-reader only when only-icon is set", async () => {
    element.setAttribute("label", "Home");
    element.setAttribute("icon-name", "home");
    element.setAttribute("only-icon", "");
    element.setAttribute("href", "#home");
    await element.updateComplete;

    const srOnly = element.shadowRoot?.querySelector(".sr-only");
    expect(srOnly).toBeTruthy();
    expect(srOnly?.textContent).toBe("Home");
  });

  it("reflects has-trailing-icon attribute", async () => {
    element.setAttribute("has-trailing-icon", "");
    await element.updateComplete;

    expect(element.hasTrailingIcon).toBe(true);
    expect(element.hasAttribute("has-trailing-icon")).toBe(true);
  });

  describe("no icon-name (icon suppressed)", () => {
    it("suppresses qgds-icon when icon-name is empty", async () => {
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector("qgds-icon");
      expect(icon).toBeFalsy();
    });

    it("removes icon-size attribute when icon-name is cleared", async () => {
      element.setAttribute("icon-name", "arrow-right");
      element.setAttribute("icon-size", "md");
      await element.updateComplete;

      element.removeAttribute("icon-name");
      await element.updateComplete;

      expect(element.hasAttribute("icon-size")).toBe(false);
    });

    it("removes has-trailing-icon attribute when icon-name is cleared", async () => {
      element.setAttribute("icon-name", "arrow-right");
      element.setAttribute("has-trailing-icon", "");
      await element.updateComplete;

      element.removeAttribute("icon-name");
      await element.updateComplete;

      expect(element.hasAttribute("has-trailing-icon")).toBe(false);
    });

    it("removes stretch attribute when icon-name is cleared", async () => {
      element.setAttribute("icon-name", "arrow-right");
      element.setAttribute("stretch", "");
      await element.updateComplete;

      element.removeAttribute("icon-name");
      await element.updateComplete;

      expect(element.hasAttribute("stretch")).toBe(false);
    });

    it("removes only-icon attribute when icon-name is cleared", async () => {
      element.setAttribute("icon-name", "arrow-right");
      element.setAttribute("only-icon", "");
      await element.updateComplete;

      element.removeAttribute("icon-name");
      await element.updateComplete;

      expect(element.hasAttribute("only-icon")).toBe(false);
    });

    it("removes animation attribute when icon-name is cleared", async () => {
      element.setAttribute("icon-name", "arrow-right");
      element.setAttribute("animation", "leftToRight");
      await element.updateComplete;

      element.removeAttribute("icon-name");
      await element.updateComplete;

      expect(element.hasAttribute("animation")).toBe(false);
    });

    it("does not apply icon CSS custom property when icon-name is empty", async () => {
      element.setAttribute("href", "/test");
      await element.updateComplete;

      const anchor = element.shadowRoot?.querySelector("a");
      expect(anchor?.getAttribute("style") ?? "").toBe("");
    });
  });
});
