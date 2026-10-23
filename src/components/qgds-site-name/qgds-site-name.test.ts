import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { QGDSSiteName } from "./qgds-site-name";
import "./qgds-site-name";

describe("qgds-site-name", () => {
  let element: QGDSSiteName;

  beforeEach(() => {
    element = document.createElement("qgds-site-name");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties and no site name", async () => {
    await element.updateComplete;

    expect(element.variant).toBe("masterbrand");
    expect(element.siteName).toBe("");
    expect(element.hideSiteName).toBe(false);
    expect(element.shadowRoot?.querySelector(".site-name")).toBeNull();
    expect(element.shadowRoot?.querySelector('[part="base"]')?.classList.contains("has-site-name")).toBe(false);
  });

  it("renders the main site name when site-name is set", async () => {
    element.setAttribute("site-name", "Department of Education");
    await element.updateComplete;

    const main = element.shadowRoot?.querySelector('[part="site-name-main"]');
    expect(main?.textContent).toBe("Department of Education");

    const base = element.shadowRoot?.querySelector('[part="base"]');
    expect(base?.classList.contains("has-site-name")).toBe(true);
  });

  it("renders the optional prefix and secondary site name", async () => {
    element.setAttribute("site-name", "Department of Education");
    element.setAttribute("site-name-prefix", "Queensland Government");
    element.setAttribute("site-name-secondary", "Early Childhood");
    await element.updateComplete;

    const prefix = element.shadowRoot?.querySelector(".prefix");
    expect(prefix?.textContent).toBe("Queensland Government");

    const secondary = element.shadowRoot?.querySelector('[part="site-name-secondary"]');
    expect(secondary?.textContent).toBe("Early Childhood");
  });

  it("visually hides the site name but keeps it in the DOM when hide-site-name is set", async () => {
    element.setAttribute("site-name", "Department of Education");
    element.setAttribute("hide-site-name", "");
    await element.updateComplete;

    const siteName = element.shadowRoot?.querySelector(".site-name");
    expect(siteName?.classList.contains("sr-only")).toBe(true);
    expect(siteName?.textContent).toContain("Department of Education");

    const base = element.shadowRoot?.querySelector('[part="base"]');
    expect(base?.classList.contains("site-name-hidden")).toBe(true);
  });

  it("reflects the variant attribute in the base class list", async () => {
    element.setAttribute("variant", "subbrand");
    await element.updateComplete;

    const base = element.shadowRoot?.querySelector('[part="base"]');
    expect(base?.classList.contains("is-subbrand")).toBe(true);
    expect(base?.classList.contains("is-masterbrand")).toBe(false);
  });
});
