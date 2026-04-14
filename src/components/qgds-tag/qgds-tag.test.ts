import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./qgds-tag";
import type { QGDSTag } from "./qgds-tag";

describe("qgds-tag", () => {
  let element: QGDSTag;

  beforeEach(() => {
    element = document.createElement("qgds-tag");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("Rendering", () => {
    it("should render with default label", async () => {
      element.label = "Test Tag";
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector(".qgds-tag-label");
      expect(label?.textContent).toBe("Test Tag");
    });
  });

  describe("Remove functionality", () => {
    it("should not show remove button by default", async () => {
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss");
      expect(removeButton).toBeNull();
    });

    it("should show remove button when dismissible variant", async () => {
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss");
      expect(removeButton).toBeTruthy();
    });

    it("should dispatch event when dismiss button is clicked", async () => {
      element.label = "Removable Tag";
      element.variant = "dismissible";
      await element.updateComplete;

      const eventSpy = vi.fn();
      element.addEventListener("qgds-dismiss", eventSpy);

      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const dismissButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss") as HTMLButtonElement;
      dismissButton?.click();

      expect(eventSpy).toHaveBeenCalledTimes(1);
    });

    it("should remove element from DOM when dismiss button is clicked", async () => {
      element.label = "Removable Tag";
      element.variant = "dismissible";
      await element.updateComplete;

      expect(document.body.contains(element)).toBe(true);
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss") as HTMLButtonElement;
      removeButton?.click();

      expect(document.body.contains(element)).toBe(false);
    });

    it("should not remove element from DOM if event is cancelled", async () => {
      element.label = "Removable Tag";
      element.variant = "dismissible";
      element.addEventListener("qgds-dismiss", (e) => {
        e.preventDefault();
      });
      await element.updateComplete;

      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss") as HTMLButtonElement;
      removeButton?.click();

      expect(document.body.contains(element)).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-label on remove button", async () => {
      element.label = "Test Label";
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss");
      expect(removeButton?.getAttribute("aria-label")).toBe("Remove Test Label");
    });

    it("should have button type on remove button", async () => {
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss");
      expect(removeButton?.getAttribute("type")).toBe("button");
    });
  });
});
