import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-inpage-nav";
import "./qgds-inpage-nav-item";

import type { QGDSInpageNav } from "./qgds-inpage-nav";

describe("qgds-inpage-nav", () => {
  let element: QGDSInpageNav;

  beforeEach(() => {
    element = document.createElement("qgds-inpage-nav");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;
    expect(element.heading).toBe("On this page");
    expect(element.headingLevel).toBe("h2");
    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav).toBeTruthy();
  });

  it("renders custom heading and heading level", async () => {
    element.setAttribute("heading", "Custom title");
    element.setAttribute("heading-level", "h3");
    await element.updateComplete;

    expect(element.heading).toBe("Custom title");
    expect(element.headingLevel).toBe("h3");
  });

  it("renders 5 qgds-inpage-nav-item as child nodes", async () => {
    const listitems = [
      { href: "#section1", text: "List item 1" },
      { href: "#section2", text: "List item 2" },
      { href: "#section3", text: "List item 3" },
      { href: "#section4", text: "List item 4" },
      { href: "#section5", text: "List item 5" },
    ];

    listitems.forEach((item) => {
      const listItemElement = document.createElement("qgds-inpage-nav-item");
      listItemElement.setAttribute("href", item.href);
      listItemElement.textContent = item.text;
      element.appendChild(listItemElement);
    });

    await element.updateComplete;

    // Query the light DOM children, not shadowRoot
    const listItemElements = element.querySelectorAll("qgds-inpage-nav-item");
    expect(listItemElements.length).toBe(listitems.length);
  });

  it("renders an unordered list by default", async () => {
    await element.updateComplete;
    const ul = element.shadowRoot?.querySelector("ul");
    const ol = element.shadowRoot?.querySelector("ol");
    expect(ul).toBeTruthy();
    expect(ol).toBeFalsy();
  });

  it("renders an ordered list when is-ordered is true", async () => {
    element.setAttribute("is-ordered", "true");
    await element.updateComplete;
    const ul = element.shadowRoot?.querySelector("ul");
    const ol = element.shadowRoot?.querySelector("ol");
    expect(ol).toBeTruthy();
    expect(ul).toBeFalsy();
  });

  // custom element uses arialabel (no hyphen) which is converted to aria-label in elements shadow DOM
  it("applies custom aria-label", async () => {
    element.setAttribute("arialabel", "Custom navigation");
    await element.updateComplete;
    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Custom navigation");
  });

  //Has children of tye qgds-inpage-nav-item
  it("renders qgds-inpage-nav-item children in the correct slot", async () => {
    const listItemElement = document.createElement("qgds-inpage-nav-item");
    listItemElement.setAttribute("href", "#section1");
    listItemElement.textContent = "Section 1";
    element.appendChild(listItemElement);

    await element.updateComplete;

    const slottedItems = element.shadowRoot
      ?.querySelector("slot")
      ?.assignedElements();
    expect(slottedItems).toBeTruthy();
    expect(slottedItems?.length).toBe(1);
    expect(slottedItems?.[0]).toBe(listItemElement);
  });
});
