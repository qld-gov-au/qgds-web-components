import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { QGDSLogo } from "./qgds-logo";
import "./qgds-logo";

describe("qgds-logo", () => {
  let element: QGDSLogo;

  beforeEach(() => {
    element = document.createElement("qgds-logo");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.logo).toBe("coa-delivering-for-qld");
    expect(element.alt).toBe("");
  });

  it("renders coa-stacked logo when logo attribute is set", async () => {
    element.logo = "coa-stacked";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders coa-delivering-for-qld logo when logo attribute is set", async () => {
    element.logo = "coa-delivering-for-qld";
    await element.updateComplete;

    const logoContainer = element.shadowRoot?.querySelector(".logo-image");
    const svg = logoContainer?.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders logo as a link when href attribute is set", async () => {
    element.logo = "coa-stacked";
    element.href = "https://www.qld.gov.au";
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("a.logo-link");
    expect(link).toBeTruthy();
    expect(link?.getAttribute("href")).toBe("https://www.qld.gov.au");
  });
});
