import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-link-item";
import "../qgds-link/qgds-link";
import type { QgdsLinkItem } from "./qgds-link-item";

describe("qgds-link-item", () => {
  let element: QgdsLinkItem;

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
    expect(element.disabled).toBe(false);
    expect(element.trailingIcon).toBe(true);
    expect(element.viewAll).toBe(false);
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
    await element.updateComplete;

    expect(element.iconName).toBe("arrow-right");
    expect(element.animation).toBe("leftToRight");

    column.remove();
  });

  it("does not override icon-name if already set when inside qgds-link-column", async () => {
    element.remove();
    element.setAttribute("icon-name", "chevron-right");
    const column = document.createElement("qgds-link-column");
    column.appendChild(element);
    document.body.appendChild(column);
    await element.updateComplete;

    expect(element.iconName).toBe("chevron-right");

    column.remove();
  });
});
