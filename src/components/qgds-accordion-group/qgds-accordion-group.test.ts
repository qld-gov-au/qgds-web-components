import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-accordion-group";
import "../qgds-accordion/qgds-accordion";
import type { QGDSAccordionGroup } from "./qgds-accordion-group";

describe("qgds-accordion-group", () => {
  let element: QGDSAccordionGroup;

  beforeEach(() => {
    element = document.createElement("qgds-accordion-group");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders defaults", async () => {
    await element.updateComplete;
    expect(element.showControls).toBe("auto");
  });

  it("Renders only qgds-accordions elements as slot children", async () => {
    element.innerHTML = `
    <qgds-accordion>   
        First
    </qgds-accordion>
    <p>I am an invalid element</p>`;

    await element.updateComplete;
    const slotElements = element.shadowRoot?.querySelector("slot")?.assignedElements();
    expect(slotElements?.length).toEqual(1);
    expect(slotElements?.[0].tagName).toBe("QGDS-ACCORDION");
  });

  it("does not render controls if showControls=false", async () => {
    element.showControls = false;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".controls")).toBeNull();
  });

  it("does render controls if show controls=true", async () => {
    element.showControls = true;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".controls")).not.toBeNull();
  });

  it("does not render controls if showControls=auto and less than 3 accordions", async () => {
    element.showControls = "auto";
    element.innerHTML = `
    <qgds-accordion>   
        First
    </qgds-accordion>
    <qgds-accordion>
        Second
    </qgds-accordion>
    `;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".controls")).toBeNull();
  });

  it("does render controls if showControls=auto and 3 or more accordions", async () => {
    element.showControls = "auto";
    element.innerHTML = `
    <qgds-accordion>   
        First
    </qgds-accordion>
    <qgds-accordion>
        Second
    </qgds-accordion>
    <qgds-accordion>
        Third
    </qgds-accordion>
    `;
    // slotted children are ready to be queried after awaiting requestAnimationFrame rather than element.updated.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const assignedElements = element.shadowRoot?.querySelector("slot")?.assignedElements();
    expect(assignedElements?.length).toEqual(3);
    expect(element.shadowRoot?.querySelector(".controls")).not.toBeNull();
  });

  it('Displays "Open all" controls if at least one accordion is closed', async () => {
    element.showControls = true;
    element.innerHTML = `
    <qgds-accordion is-open>   
        First is open
    </qgds-accordion>
    <qgds-accordion is-open>
        Second is open
    </qgds-accordion>
    <qgds-accordion>
        Third is closed
    </qgds-accordion>`;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(element.shadowRoot?.querySelector(".controls")?.textContent.trim()).toBe("Open all");
  });

  it('Displays "Close all" controls every accordion is open', async () => {
    element.showControls = true;
    element.innerHTML = `
    <qgds-accordion is-open>   
        First is open
    </qgds-accordion>
    <qgds-accordion is-open>
        Second is open
    </qgds-accordion>
    <qgds-accordion is-open>
        Third is open
    </qgds-accordion>`;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(element.shadowRoot?.querySelector(".controls")?.textContent.trim()).toBe("Open all");
  });

  it("Opens and closes all accordions", async () => {
    element.showControls = true;
    element.innerHTML = `
    <qgds-accordion>   
        First is closed
    </qgds-accordion>
    <qgds-accordion>
        Second is closed
    </qgds-accordion>
    <qgds-accordion>
        Third is closed
    </qgds-accordion>`;

    await new Promise((resolve) => requestAnimationFrame(resolve));
    const accordions = element.querySelectorAll("qgds-accordion");
    expect(accordions.length).toBe(3);

    const controls = element.shadowRoot?.querySelector(".controls");
    if (controls) (controls as HTMLButtonElement).click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(Array.from(accordions).every((accordion) => accordion.isOpen)).toBe(true);

    if (controls) (controls as HTMLButtonElement).click();
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(Array.from(accordions).every((accordion) => accordion.isOpen)).toBe(false);
  });
});
