import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-inpage-nav";
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
    expect(element.navtitle).toBe("On this page");
    expect(element.headingLevel).toBe("h2");
    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav).toBeTruthy();
  });

  it("renders the correct number of nav items", async () => {
    const listitems = [
      { linkid: "section1", linktext: "List item 1" },
      { linkid: "section2", linktext: "List item 2" },
      { linkid: "section3", linktext: "List item 3" },
      { linkid: "section4", linktext: "List item 4" },
      { linkid: "section5", linktext: "List item 5" },
    ];
    element.navitems = listitems;
    await element.updateComplete;
    const listItemElements = element.shadowRoot?.querySelectorAll("li");
    expect(listItemElements?.length).toBe(listitems.length);
  });

  it("renders nav item text content correctly", async () => {
    const listitems = [
      { linkid: "section1", linktext: "First" },
      { linkid: "section2", linktext: "Second" },
      { linkid: "section3", linktext: "Third" },
    ];
    element.navitems = listitems;
    await element.updateComplete;
    const listItemElements = element.shadowRoot?.querySelectorAll("li");
    expect(listItemElements?.length).toBe(listitems.length);
    listitems.forEach((item, idx) => {
      expect(listItemElements?.[idx]?.textContent).toContain(item.linktext);
    });
  });
});
