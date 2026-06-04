import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-footer";
import "../qgds-link/qgds-link";
import "./qgds-footer-contact-item";
import type { QGDSFooter } from "./qgds-footer";
import type { QGDSFooterContactItem } from "./qgds-footer-contact-item";

describe("qgds-footer", () => {
  let element: QGDSFooter;

  beforeEach(() => {
    element = document.createElement("qgds-footer");
    element.copyrightLabel = "© The State of Queensland 2026";
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    const footer = element.shadowRoot?.querySelector(".qgds-footer");
    expect(footer).toBeTruthy();
    expect(element.contactHeading).toBe("Contact us");
    expect(element.socialHeading).toBe("Follow us");
    expect(element.aocHeading).toBe("Acknowledgement of Country");
    expect(element.headingLevel).toBe(2);
    expect(element.palette).toBe("default");
  });

  it("renders custom headings and custom labels", async () => {
    element.setAttribute("contact-heading", "Contact the Team");
    element.setAttribute("social-heading", "Check us out");
    element.setAttribute("copyright-label", "© Queensland Government 2026");
    await element.updateComplete;

    const copyright = element.shadowRoot?.querySelector(".copyright");
    expect(copyright?.textContent?.trim()).toBe("© Queensland Government 2026");

    const headings = Array.from(element.shadowRoot?.querySelectorAll(".footer-heading") ?? []);
    const headingTexts = headings.map((h) => h.textContent?.trim());
    expect(headingTexts).toContain("Contact the Team");
    expect(headingTexts).toContain("Check us out");
  });

  it("renders phone and email links dynamically", async () => {
    element.contactPhone = "13 74 68";
    element.contactEmail = "info@qld.gov.au";
    await element.updateComplete;

    const phoneLink = element.shadowRoot?.querySelector('a[href="tel:137468"]');
    expect(phoneLink).toBeTruthy();
    expect(phoneLink?.textContent?.trim()).toBe("13 74 68");

    const emailLink = element.shadowRoot?.querySelector('a[href="mailto:info@qld.gov.au"]');
    expect(emailLink).toBeTruthy();
    expect(emailLink?.textContent?.trim()).toBe("info@qld.gov.au");
  });

  it("renders slotted custom, site, and social links", async () => {
    element.innerHTML = `
      <qgds-link slot="footer-custom-link" href="/about">About Us</qgds-link>
      <qgds-link slot="footer-site-link" href="/privacy">Privacy Policy</qgds-link>
      <qgds-link slot="footer-social-link" href="https://facebook.com">Facebook</qgds-link>
    `;

    // Wait for the slot change event handlers to execute and update state
    await element.updateComplete;

    const customSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-custom-link"]');
    expect(customSlot?.assignedElements().length).toBe(1);

    const siteSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-site-link"]');
    expect(siteSlot?.assignedElements().length).toBe(1);

    const socialSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-social-link"]');
    expect(socialSlot?.assignedElements().length).toBe(1);
  });

  it("renders falling back site logo when no custom logo is slotted", async () => {
    await element.updateComplete;

    // By default, no logo is in the light DOM slot, so it should fall back to inside the slot
    const logoSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-logo"]');
    expect(logoSlot).toBeTruthy();

    const fallbackSvg = logoSlot?.querySelector("svg");
    expect(fallbackSvg).toBeTruthy();
  });

  it("incorporates slotted logo and overrides the default logo fallback", async () => {
    element.innerHTML = `
      <img slot="footer-logo" src="/logo.png" alt="Custom Gov Logo">
    `;
    await element.updateComplete;

    const logoSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-logo"]');
    const assignedElements = logoSlot?.assignedElements();
    expect(assignedElements?.length).toBe(1);
    expect(assignedElements?.[0].tagName.toLowerCase()).toBe("img");
    expect(assignedElements?.[0].getAttribute("alt")).toBe("Custom Gov Logo");
  });

  it("renders slotted Acknowledgement of Country content", async () => {
    element.innerHTML = `
      <div slot="aoc">
        <p>Custom Acknowledgement of Country statement</p>
      </div>
    `;
    await element.updateComplete;

    const aocSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="aoc"]');
    expect(aocSlot?.assignedElements().length).toBe(1);
    expect(aocSlot?.assignedElements()[0].textContent?.trim()).toContain("Custom Acknowledgement of Country statement");
  });
});

describe("qgds-footer-contact-item", () => {
  let element: QGDSFooterContactItem;

  beforeEach(() => {
    element = document.createElement("qgds-footer-contact-item");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("applies attributes correctly", async () => {
    element.setAttribute("icon-id", "phone");
    element.setAttribute("label", "Contact us");
    element.setAttribute("href", "tel:137468");

    await element.updateComplete;

    expect(element.iconId).toBe("phone");
    expect(element.label).toBe("Contact us");
    expect(element.href).toBe("tel:137468");
  });

  it("does not render an icon when icon-id is invalid", async () => {
    element.setAttribute("icon-id", "not-a-valid-icon");
    element.setAttribute("label", "Contact us");

    await element.updateComplete;

    expect(element.iconId).toBe("");
    expect(element.shadowRoot?.querySelector("qgds-icon")).toBeNull();
  });

  it("accepts missing icon-id and renders without an icon", async () => {
    element.setAttribute("label", "Contact us");
    element.setAttribute("href", "tel:137468");

    await element.updateComplete;

    expect(element.iconId).toBe("");
    expect(element.shadowRoot?.querySelector("qgds-icon")).toBeNull();
    expect(element.label).toBe("Contact us");
    expect(element.href).toBe("tel:137468");
  });
});
