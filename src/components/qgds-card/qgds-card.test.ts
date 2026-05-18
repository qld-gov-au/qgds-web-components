import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-card";
import type { QGDSCard } from "./qgds-card";

describe("qgds-card", () => {
  let element: QGDSCard;

  const triggerSlotChange = async (slotName: "footer-links" | "footer-tags" | "footer-text") => {
    const slot = element.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement | null;
    expect(slot).toBeTruthy();
    slot?.dispatchEvent(new Event("slotchange"));
    await element.updateComplete;
  };

  beforeEach(() => {
    element = document.createElement("qgds-card");
    element.heading = "Card heading";
    element.setAttribute("icon-name", "arrow-right");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("no-action", () => {
    it("renders body content without a functional heading link by default", async () => {
      element.innerHTML = "<p>Supporting card content</p>";

      await element.updateComplete;

      expect(element.action).toBe("none");

      const card = element.shadowRoot?.querySelector(".card");
      const heading = element.shadowRoot?.querySelector(".heading");
      const slot = element.shadowRoot?.querySelector(".content slot") as HTMLSlotElement | null;
      const assignedElements = slot?.assignedElements();

      expect(card?.classList.contains("is-single")).toBe(false);
      expect(heading?.textContent?.trim()).toBe("Card heading");
      expect(heading?.querySelector("a")).toBeNull();
      expect(assignedElements?.length).toBe(1);
      expect(assignedElements?.[0].tagName).toBe("P");
      expect(assignedElements?.[0].textContent).toContain("Supporting card content");
    });

    it("renders a qgds-image when image-src is provided", async () => {
      element.setAttribute("image-src", "/assets/example.jpg");
      element.setAttribute("image-alt", "Example image");

      await element.updateComplete;

      const image = element.shadowRoot?.querySelector("qgds-image");

      expect(image).toBeTruthy();
      expect(image?.getAttribute("src")).toBe("/assets/example.jpg");
      expect(image?.getAttribute("alt")).toBe("Example image");
      expect(image?.getAttribute("aspect")).toBe("3:2");
    });
  });

  describe("single-action", () => {
    it("turns href into a functional heading link and emits qgds-click", async () => {
      element.action = "single";
      element.href = "/cards/detail";
      element.target = "_blank";

      await element.updateComplete;

      const handler = vi.fn();
      element.addEventListener("qgds-click", handler);

      const card = element.shadowRoot?.querySelector(".card");
      const link = element.shadowRoot?.querySelector<HTMLAnchorElement>(".heading a");

      expect(card?.classList.contains("is-single")).toBe(true);
      expect(card?.getAttribute("role")).toBeNull();
      expect(link).toBeTruthy();
      expect(link?.getAttribute("href")).toBe("/cards/detail");
      expect(link?.getAttribute("target")).toBe("_blank");
      expect(link?.getAttribute("rel")).toBe("noopener noreferrer");

      link?.click();

      expect(handler).toHaveBeenCalledTimes(1);

      const event = handler.mock.calls[0]?.[0] as CustomEvent<{
        label: string;
        href: string;
        component: string;
        originalEvent: Event;
      }>;

      expect(event.detail.label).toBe("Card heading");
      expect(event.detail.href).toBe("/cards/detail");
      expect(event.detail.component).toBe("qgds-card");
      expect(event.detail.originalEvent).toBeTruthy();
    });
  });

  describe("multi-action", () => {
    it("recognises embedded qgds-links in the footer", async () => {
      element.action = "multiple";
      element.innerHTML = `
				<p>Supporting card content</p>
				<qgds-link slot="footer-links" href="/one">First link</qgds-link>
				<qgds-link slot="footer-links" href="/two">Second link</qgds-link>
			`;

      await element.updateComplete;
      await triggerSlotChange("footer-links");

      const card = element.shadowRoot?.querySelector(".card");
      const footerLinksSlot = element.shadowRoot?.querySelector('slot[name="footer-links"]') as HTMLSlotElement | null;
      const assignedElements = footerLinksSlot?.assignedElements();

      expect(card?.classList.contains("is-multiple")).toBe(true);
      expect(card?.classList.contains("has-footer")).toBe(true);
      expect(card?.classList.contains("has-footer-links")).toBe(true);
      expect(card?.classList.contains("has-footer-tags")).toBe(false);
      expect(assignedElements?.length).toBe(2);
      expect(assignedElements?.every((assigned) => assigned.tagName === "QGDS-LINK")).toBe(true);
    });

    it("recognises embedded qgds-tags in the footer", async () => {
      element.action = "multiple";
      element.innerHTML = `
				<p>Supporting card content</p>
				<qgds-tag slot="footer-tags">News</qgds-tag>
				<qgds-tag slot="footer-tags">Updates</qgds-tag>
			`;

      await element.updateComplete;
      await triggerSlotChange("footer-tags");

      const card = element.shadowRoot?.querySelector(".card");
      const footerTagsSlot = element.shadowRoot?.querySelector('slot[name="footer-tags"]') as HTMLSlotElement | null;
      const assignedElements = footerTagsSlot?.assignedElements();

      expect(card?.classList.contains("is-multiple")).toBe(true);
      expect(card?.classList.contains("has-footer")).toBe(true);
      expect(card?.classList.contains("has-footer-tags")).toBe(true);
      expect(assignedElements?.length).toBe(2);
      expect(assignedElements?.every((assigned) => assigned.tagName === "QGDS-TAG")).toBe(true);
    });
  });
});
