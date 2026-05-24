import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./qgds-footer";
import "../qgds-link/qgds-link";
import type { QGDSFooter } from "./qgds-footer";

describe("qgds-footer", () => {
  let element: QGDSFooter;

  beforeEach(() => {
    element = document.createElement("qgds-footer");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;
    
    const footer = element.shadowRoot?.querySelector("footer");
    expect(footer).toBeTruthy();
    expect(element.contactHeading).toBe("Contact us");
    expect(element.socialHeading).toBe("Follow us");
    expect(element.aocHeading).toBe("Acknowledgement of Country");
    expect(element.headingLevel).toBe(2);
    expect(element.palette).toBe("default");
  });

  it("renders custom headings", async () => {
    element.setAttribute("contact-heading", "Get in touch");
    element.setAttribute("social-heading", "Connect with us");
    element.setAttribute("aoc-heading", "Acknowledgement");
    await element.updateComplete;

    const headings = element.shadowRoot?.querySelectorAll(".footer-heading");
    expect(headings).toBeTruthy();
    expect(headings?.length).toBeGreaterThan(0);
  });

  it("renders copyright label", async () => {
    element.copyrightLabel = "© Queensland Government 2026";
    await element.updateComplete;

    const copyright = element.shadowRoot?.querySelector(".copyright");
    expect(copyright?.textContent).toBe("© Queensland Government 2026");
  });

  it("renders contact phone and email when provided", async () => {
    element.contactPhone = "13 QGOV (13 74 68)";
    element.contactEmail = "email@qld.gov.au";
    await element.updateComplete;

    const phoneLink = element.shadowRoot?.querySelector('a[href^="tel:"]');
    const emailLink = element.shadowRoot?.querySelector('a[href^="mailto:"]');
    
    expect(phoneLink).toBeTruthy();
    expect(phoneLink?.textContent?.trim()).toBe("13 QGOV (13 74 68)");
    expect(emailLink).toBeTruthy();
    expect(emailLink?.getAttribute("href")).toBe("mailto:email@qld.gov.au");
  });

  it("renders contact statement when provided", async () => {
    element.contactStatement = "Get in touch for enquiries, feedback, complaints and compliments.";
    await element.updateComplete;

    const statement = element.shadowRoot?.querySelector(".contact-statement");
    expect(statement?.textContent).toBe("Get in touch for enquiries, feedback, complaints and compliments.");
  });

  it("renders slotted site links", async () => {
    element.innerHTML = `
      <qgds-link slot="footer-site-link" href="/help">Help</qgds-link>
      <qgds-link slot="footer-site-link" href="/copyright">Copyright</qgds-link>
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-site-link"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(2);
    expect(assignedElements?.[0].tagName.toLowerCase()).toBe("qgds-link");
  });

  it("renders slotted custom links", async () => {
    element.innerHTML = `
      <qgds-link slot="footer-custom-link" href="/about">About</qgds-link>
      <qgds-link slot="footer-custom-link" href="/contact">Contact</qgds-link>
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-custom-link"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(2);
    expect(assignedElements?.[0].tagName.toLowerCase()).toBe("qgds-link");
  });

  it("renders slotted social links", async () => {
    element.innerHTML = `
      <qgds-link slot="footer-social-link" href="https://facebook.com" icon-name="facebook">Facebook</qgds-link>
      <qgds-link slot="footer-social-link" href="https://twitter.com" icon-name="twitter">Twitter</qgds-link>
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-social-link"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(2);
  });

  it("renders slotted AOC content", async () => {
    element.innerHTML = `
      <div slot="aoc">
        <p>We pay our respects to the Aboriginal and Torres Strait Islander ancestors of this land.</p>
      </div>
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="aoc"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(1);
  });

  it("renders slotted logo", async () => {
    element.innerHTML = `
      <img slot="footer-logo" src="/logo.png" alt="Queensland Government">
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-logo"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(1);
    expect(assignedElements?.[0].tagName.toLowerCase()).toBe("img");
  });

  it("renders slotted site main link", async () => {
    element.innerHTML = `
      <qgds-link slot="site-main-link" href="https://www.qld.gov.au">Queensland Government</qgds-link>
    `;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="site-main-link"]');
    const assignedElements = slot?.assignedElements();
    
    expect(assignedElements?.length).toBe(1);
  });

  it("uses custom heading level", async () => {
    element.headingLevel = 3;
    await element.updateComplete;

    const heading = element.shadowRoot?.querySelector(".footer-heading");
    expect(heading?.tagName).toBe("H3");
  });

  it("validates heading level within range (2-6)", async () => {
    element.setAttribute("heading-level", "1");
    await element.updateComplete;
    expect(element.headingLevel).toBe(2); // Defaults to 2 for invalid values

    element.setAttribute("heading-level", "7");
    await element.updateComplete;
    expect(element.headingLevel).toBe(2);

    element.setAttribute("heading-level", "4");
    await element.updateComplete;
    expect(element.headingLevel).toBe(4);
  });

  it("applies aria-labelledby to footer sections", async () => {
    await element.updateComplete;

    const contactSection = element.shadowRoot?.querySelector(".footer-contact");
    expect(contactSection?.getAttribute("aria-labelledby")).toBe("footer-contact-heading");
    
    const aocSection = element.shadowRoot?.querySelector(".footer-aoc");
    expect(aocSection?.getAttribute("aria-labelledby")).toBe("footer-aoc-heading");
  });

  it("conditionally renders social section only when social links are slotted", async () => {
    await element.updateComplete;
    
    let socialSection = element.shadowRoot?.querySelector(".footer-social");
    expect(socialSection?.classList.contains("hidden")).toBe(true);

    element.innerHTML = `
      <qgds-link slot="footer-social-link" href="https://facebook.com">Facebook</qgds-link>
    `;
    await element.updateComplete;
    // Wait for slotchange event to propagate and state to update
    await element.updateComplete;

    socialSection = element.shadowRoot?.querySelector(".footer-social");
    expect(socialSection?.classList.contains("hidden")).toBe(false);
  });

  it("warns when non-qgds-link elements are slotted in link slots", async () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    element.innerHTML = `
      <a slot="footer-site-link" href="/help">Help</a>
    `;
    await element.updateComplete;

    // Trigger slot change
    const slot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="footer-site-link"]');
    slot?.dispatchEvent(new Event("slotchange"));
    await element.updateComplete;

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("footer-site-link slot should contain <qgds-link> elements")
    );

    consoleWarnSpy.mockRestore();
  });

  it("warns when copyright-label is not provided", async () => {
    // Create a new element without copyright label to test the warning
    const newElement = document.createElement("qgds-footer");
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    
    document.body.appendChild(newElement);
    await newElement.updateComplete;

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('"copyright-label" attribute is required')
    );

    consoleWarnSpy.mockRestore();
    newElement.remove();
  });

  it("applies palette attribute", async () => {
    element.palette = "deep";
    await element.updateComplete;

    expect(element.getAttribute("palette")).toBe("deep");
  });
});
