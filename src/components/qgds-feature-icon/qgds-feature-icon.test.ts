import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-feature-icon";
import type { QGDSFeatureIcon } from "./qgds-feature-icon";

describe("qgds-feature-icon", () => {
  let element: QGDSFeatureIcon;

  beforeEach(() => {
    element = document.createElement("qgds-feature-icon");
  });

  afterEach(() => {
    element.remove();
  });

  it("renders an icon when icon-id is provided", async () => {
    element.setAttribute("icon-id", "search");
    document.body.appendChild(element);
    await element.updateComplete;

    const icon = element.shadowRoot?.querySelector("qgds-icon");
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute("icon-id")).toBe("search");
  });
});
