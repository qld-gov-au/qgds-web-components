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

    // TODO: default and info variants render small, action and dismissible render large
  });

  describe("Remove functionality", () => {
    it("should not show remove button by default", async () => {
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-remove");
      expect(removeButton).toBeNull();
    });

    it("should show remove button when dismissible variant", async () => {
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-remove");
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
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { label: "Removable Tag" },
        })
      );
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

    it("should have proper aria-label on remove button", async () => {
      element.label = "Test Label";
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-dismiss");
      expect(removeButton?.getAttribute("aria-label")).toBe("Remove Test Label");
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure", async () => {
      element.label = "Accessible Tag";
      await element.updateComplete;

      const tag = element.shadowRoot?.querySelector(".qgds-tag");
      expect(tag).toBeTruthy();
    });

    it("should have button type on remove button", async () => {
      element.variant = "dismissible";
      await element.updateComplete;

      const removeButton = element.shadowRoot?.querySelector(".qgds-tag-remove");
      expect(removeButton?.getAttribute("type")).toBe("button");
    });
  });

  // describe("Event bubbling", () => {
  //   it("should bubble remove event", async () => {
  //     element.label = "Removable Tag";
  //     element.variant = "dismissible";
  //     await element.updateComplete;

  //     const eventSpy = vi.fn();
  //     document.addEventListener("qgds-tag-remove", eventSpy);

  //     const removeButton = element.shadowRoot?.querySelector(".tag__remove") as HTMLElement;
  //     removeButton?.click();

  //     expect(eventSpy).toHaveBeenCalledTimes(1);

  //     document.removeEventListener("qgds-tag-remove", eventSpy);
  //   });
  // });
});
