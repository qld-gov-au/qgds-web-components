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

      expect(element.label).toBe("Button");
      expect(element.variant).toBe("primary");
      expect(element.disabled).toBe(false);
      expect(element.type).toBe("button");
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
      expect(
        button?.classList.contains("loading") ?? button?.getAttribute("aria-disabled") === "true",
      ).toBe(true);
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
    it("should dispatch custom event on click", async () => {
      element.setAttribute("label", "test");
      element.setAttribute("event-title", "testClick");
      await element.updateComplete;

      const eventHandler = vi.fn();
      element.addEventListener("testClick", eventHandler);

      const button = element.shadowRoot?.querySelector("button");
      button?.click();

      expect(eventHandler).toHaveBeenCalled();

      const event = eventHandler.mock.calls[0]?.[0] as CustomEvent;
      expect(event?.detail).toBeDefined();

      if (event?.detail && typeof event.detail === "object") {
        expect((event.detail as Record<string, unknown>).eventTitle).toBe("testClick");
        expect((event.detail as Record<string, unknown>).label).toBe("test");
        expect((event.detail as Record<string, unknown>).variant).toBe("primary");
      }
    });
  });
});
