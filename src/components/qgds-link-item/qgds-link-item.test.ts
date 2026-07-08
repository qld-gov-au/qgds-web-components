import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-link-item";
import "../qgds-link/qgds-link";
import "../qgds-link-column/qgds-link-column";
import type { QGDSLinkItem } from "./qgds-link-item";
import type { QGDSLink } from "../qgds-link/qgds-link";

describe("qgds-link-item", () => {
  let element: QGDSLinkItem;

  beforeEach(() => {
    element = document.createElement("qgds-link-item");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBe("");
    expect(element.href).toBe("");
    expect(element.description).toBe("");
    expect(element.isDisabled).toBe(false);
    expect(element.iconName).toBe("");
    expect(element.iconSize).toBe("md");
    expect(element.animation).toBe("");
  });

  it("sets role='listitem' on host element", async () => {
    await element.updateComplete;

    expect(element.getAttribute("role")).toBe("listitem");
  });

  it("renders a qgds-link inside", async () => {
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link).toBeTruthy();
  });

  it("renders a description paragraph when description is provided", async () => {
    element.setAttribute("description", "Supporting text here");
    await element.updateComplete;

    const p = element.shadowRoot?.querySelector("p.description");
    expect(p).toBeTruthy();
    expect(p?.textContent).toContain("Supporting text here");
  });

  it("does not render a description paragraph when description is empty", async () => {
    await element.updateComplete;

    const p = element.shadowRoot?.querySelector("p.description");
    expect(p).toBeFalsy();
  });

  it("auto-sets arrow-right icon and leftToRight animation inside qgds-link-column", async () => {
    element.remove();
    const column = document.createElement("qgds-link-column");
    column.appendChild(element);
    document.body.appendChild(column);
    await column.updateComplete;
    await element.updateComplete;

    expect(element.iconName).toBe("arrow-right");
    expect(element.animation).toBe("leftToRight");

    column.remove();
  });

  it("does not override icon-name if already set when inside qgds-link-column", async () => {
    element.remove();
    element.setAttribute("icon-name", "arrow-right");
    const column = document.createElement("qgds-link-column");
    column.appendChild(element);
    document.body.appendChild(column);
    await element.updateComplete;

    expect(element.iconName).toBe("arrow-right");

    column.remove();
  });

  it("passes iconName to the inner qgds-link", async () => {
    element.setAttribute("icon-name", "arrow-right");
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link") as QGDSLink | null;
    expect(link?.iconName).toBe("arrow-right");
  });

  it("does not pass iconSize or animation to inner qgds-link when iconName is empty", async () => {
    element.iconName = "";
    element.setAttribute("icon-size", "md");
    element.setAttribute("animation", "leftToRight");
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link") as QGDSLink | null;
    expect(link?.iconName).toBeFalsy();
    expect(link?.iconSize).toBeFalsy();
    expect(link?.animation).toBeFalsy();
  });

  it("accepts external-link as icon-name", async () => {
    element.setAttribute("icon-name", "external-link");
    await element.updateComplete;

    expect(element.iconName).toBe("external-link");
    const link = element.shadowRoot?.querySelector("qgds-link") as QGDSLink | null;
    expect(link?.iconName).toBe("external-link");
  });
});
