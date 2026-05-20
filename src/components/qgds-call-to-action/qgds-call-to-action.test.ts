import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-call-to-action";
import "../qgds-link/qgds-link";
import type { QGDSCallToAction } from "./qgds-call-to-action";

describe("qgds-call-to-action", () => {
  let element: QGDSCallToAction;

  beforeEach(() => {
    element = document.createElement("qgds-call-to-action");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBe("View all");
    expect(element.href).toBe("#");
    expect(element.isViewAll).toBe(false);
  });

  it("renders a qgds-link inside", async () => {
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link).toBeTruthy();
  });

  it("uses arrow-right icon and md size by default", async () => {
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.getAttribute("icon-name")).toBe("arrow-right");
    expect(link?.getAttribute("icon-size")).toBe("md");
  });

  it("uses view-all icon and lg size when is-view-all is set", async () => {
    element.setAttribute("is-view-all", "");
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.getAttribute("icon-name")).toBe("view-all");
    expect(link?.getAttribute("icon-size")).toBe("lg");
  });

  it("passes label and href to qgds-link", async () => {
    element.setAttribute("label", "View all permits");
    element.setAttribute("href", "/permits");
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.getAttribute("label")).toBe("View all permits");
    expect(link?.getAttribute("href")).toBe("/permits");
  });

  it("reflects is-view-all attribute", async () => {
    element.setAttribute("is-view-all", "");
    await element.updateComplete;

    expect(element.isViewAll).toBe(true);
    expect(element.hasAttribute("is-view-all")).toBe(true);
  });
});
