import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-accordion";
import type { QGDSAccordion } from "./qgds-accordion";

describe("qgds-accordion", () => {
  let element: QGDSAccordion;

  beforeEach(() => {
    element = document.createElement("qgds-accordion");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders defaults", async () => {
    await element.updateComplete;

    expect(element.title).toBe("");
    expect(element.isOpen).toBe(false);
  });

  it("Renders title attribute as summary text", async () => {
    const title = "Here is the title";
    element.title = title;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".summary")?.textContent.trim()).toBe(title);
  });

  it("Renders childnodes as slot content.", async () => {
    const textNode = "This is a plain text node.";
    const paragraph = "And this is paragraph content";
    element.innerHTML = `${textNode}<p>${paragraph}</p>`;
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector("slot");
    expect(slot?.assignedNodes().length).toEqual(2);
    expect(slot?.assignedNodes()[0].textContent).toBe(textNode);
    expect(slot?.assignedNodes()[1].textContent).toBe(paragraph);
    expect(slot?.assignedNodes()[1].nodeName).toBe("P");
  });

  it("Opens and closes on click", async () => {
    element.isOpen = false;
    await element.updateComplete;

    const summary = element.shadowRoot?.querySelector(".summary");

    if (summary instanceof HTMLElement) summary.click();
    // The click event will only be caught during next tick, after which component will update;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(element.isOpen).toBe(true);

    if (summary instanceof HTMLElement) summary.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(element.isOpen).toBe(false);
  });

  it("Opens if window.location.hash equals its id", async () => {
    element.id = "test";
    element.isOpen = false;
    await element.updateComplete;

    window.location.hash = "test";
    // The click event will only be caught during next tick, after which component will update;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;
    expect(element.isOpen).toBe(true);
  });
});
