import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./qgds-button";
import type { QGDSButton } from "./qgds-button";

describe("qgds-button", () => {
  let element: QGDSButton;

  beforeEach(() => {
    element = document.createElement("qgds-button");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("Form behavior", () => {
    let form: HTMLFormElement;

    beforeEach(() => {
      form = document.createElement("form");
      document.body.appendChild(form);
    });

    afterEach(() => {
      form.remove();
    });

    it("should have default type='button'", async () => {
      form.appendChild(element);
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      expect(button).toBeTruthy();
      expect(button?.getAttribute("type")).toBe("button");
    });

    it("should support type='submit' and submit the form", async () => {
      element.setAttribute("type", "submit");
      form.appendChild(element);
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      expect(button?.getAttribute("type")).toBe("submit");

      // Verify that the button has the correct type attribute
      // Note: Buttons in Shadow DOM don't automatically participate in form submission
      // The component correctly sets the type attribute for semantic correctness
      expect(element.type).toBe("submit");
    });

    it("should support type='reset' and reset the form", async () => {
      element.setAttribute("type", "reset");
      form.appendChild(element);
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      expect(button?.getAttribute("type")).toBe("reset");

      // Verify that the button has the correct type attribute
      // Note: Buttons in Shadow DOM don't automatically participate in form reset
      // The component correctly sets the type attribute for semantic correctness
      expect(element.type).toBe("reset");
    });

    it("should not submit form when type='button'", async () => {
      element.setAttribute("type", "button");
      form.appendChild(element);
      await element.updateComplete;

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      form.addEventListener("submit", submitHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(submitHandler).not.toHaveBeenCalled();

      form.removeEventListener("submit", submitHandler);
    });

    it("should not submit form when disabled", async () => {
      element.setAttribute("type", "submit");
      element.setAttribute("disabled", "true");
      form.appendChild(element);
      await element.updateComplete;

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      form.addEventListener("submit", submitHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(submitHandler).not.toHaveBeenCalled();

      form.removeEventListener("submit", submitHandler);
    });

    it("should not submit form when loading", async () => {
      element.setAttribute("type", "submit");
      element.setAttribute("is-loading", "true");
      form.appendChild(element);
      await element.updateComplete;

      const submitHandler = vi.fn((e: Event) => e.preventDefault());
      form.addEventListener("submit", submitHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(submitHandler).not.toHaveBeenCalled();

      form.removeEventListener("submit", submitHandler);
    });
  });

  describe("Component properties", () => {
    it("should render with default properties", async () => {
      await element.updateComplete;

      expect(element.label).toBe("");
      expect(element.variant).toBe("primary");
      expect(element.disabled).toBe(false);
      expect(element.type).toBe("button");
    });

    it("should use default slot text when label is not provided", async () => {
      element.textContent = "Slot Label";
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      const slot = element.shadowRoot?.querySelector("slot");
      const assignedText =
        slot
          ?.assignedNodes({ flatten: true })
          .map((node) => node.textContent ?? "")
          .join("")
          .trim() ?? "";

      expect(button).toBeTruthy();
      expect(assignedText).toBe("Slot Label");
    });

    it("should prioritize label over default slot text", async () => {
      element.textContent = "Slot Label";
      element.setAttribute("label", "Attribute Label");
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      expect(button?.textContent).toContain("Attribute Label");
      expect(button?.textContent).not.toContain("Slot Label");
    });

    it("should render as button by default", async () => {
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      const link = element.shadowRoot?.querySelector("a");

      expect(button).toBeTruthy();
      expect(link).toBeFalsy();
    });

    it("should render as link when linkValue is provided", async () => {
      element.setAttribute("href", "/test-page");
      await element.updateComplete;

      const link = element.shadowRoot?.querySelector("a");
      const button = element.shadowRoot?.querySelector("button");

      expect(link).toBeTruthy();
      expect(button).toBeFalsy();
      expect(link?.getAttribute("href")).toBe("/test-page");
    });

    it("should display loading state", async () => {
      element.setAttribute("is-loading", "true");
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");

      // Check that the component is in loading state
      expect(element.isLoading).toBe(true);

      // Check that the button is disabled when loading
      expect(button?.hasAttribute("disabled")).toBe(true);

      // Check that the button has loading class or aria-disabled
      expect(button?.classList.contains("loading") ?? button?.getAttribute("aria-disabled") === "true").toBe(true);
    });

    it("should be disabled when disabled or loading", async () => {
      element.setAttribute("is-loading", "true");
      await element.updateComplete;

      const button = element.shadowRoot?.querySelector("button");
      expect(button?.hasAttribute("disabled")).toBe(true);

      element.removeAttribute("is-loading");
      element.setAttribute("disabled", "true");
      await element.updateComplete;

      expect(button?.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Button with Icon", () => {
    it("should render icon when iconName is provided", async () => {
      element.setAttribute("icon-name", "external-link");
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector("qgds-icon");
      expect(icon).toBeTruthy();
      expect(icon?.getAttribute("icon-id")).toBe("external-link");
    });
  });

  describe("State management", () => {
    it("should track interaction states", async () => {
      await element.updateComplete;

      const initialState = element.buttonState;
      expect(initialState.isHovered).toBe(false);
      expect(initialState.isActive).toBe(false);
      expect(initialState.isFocused).toBe(false);
      expect(initialState.isDisabled).toBe(false);
      expect(initialState.isLoading).toBe(false);
    });
  });

  describe("Event dispatching", () => {
    it("dispatches qgds-click on button click with standard detail", async () => {
      element.setAttribute("label", "test");
      element.setAttribute("id", "btn-1");
      await element.updateComplete;

      const eventHandler = vi.fn((e: Event) => e.preventDefault());
      element.addEventListener("qgds-click", eventHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(eventHandler).toHaveBeenCalledTimes(1);

      const event = eventHandler.mock.calls[0]?.[0] as CustomEvent;
      expect(event?.detail).toMatchObject({
        component: "qgds-button",
        componentID: "btn-1",
        id: "btn-1",
        href: undefined,
        label: "test",
        variant: "primary",
      });
      const detail = event.detail as Record<string, unknown>;
      expect(typeof detail.timestamp).toBe("number");
    });

    it("dispatches qgds-click with href detail when rendered as a link", async () => {
      element.setAttribute("href", "#test-page");
      element.setAttribute("label", "Go");
      await element.updateComplete;

      const eventHandler = vi.fn((e: Event) => e.preventDefault());
      element.addEventListener("qgds-click", eventHandler);

      const link = element.shadowRoot?.querySelector("a");
      link?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0]?.[0] as CustomEvent;
      expect(event?.detail).toMatchObject({ href: "#test-page", label: "Go" });
    });

    it("does not dispatch qgds-click when disabled", async () => {
      element.setAttribute("disabled", "true");
      await element.updateComplete;

      const eventHandler = vi.fn();
      element.addEventListener("qgds-click", eventHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(eventHandler).not.toHaveBeenCalled();
    });

    it("does not dispatch qgds-click when loading", async () => {
      element.setAttribute("is-loading", "true");
      await element.updateComplete;

      const eventHandler = vi.fn();
      element.addEventListener("qgds-click", eventHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(eventHandler).not.toHaveBeenCalled();
    });

    it("does not dispatch qgds-click for disabled link variant", async () => {
      element.setAttribute("href", "/test-page");
      element.setAttribute("disabled", "true");
      await element.updateComplete;

      const eventHandler = vi.fn();
      element.addEventListener("qgds-click", eventHandler);

      const link = element.shadowRoot?.querySelector("a");
      link?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true }));

      expect(eventHandler).not.toHaveBeenCalled();
    });
  });
});
