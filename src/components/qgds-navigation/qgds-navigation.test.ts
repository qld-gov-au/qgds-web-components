import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { type QGDSNavigation } from "./qgds-navigation";
import "../qgds-navigation/qgds-navigation";

describe("qgds-navigation", () => {
  let element: QGDSNavigation;

  beforeEach(() => {
    element = document.createElement("qgds-navigation");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.variant).toBe("horizontal");
    expect(element.palette).toBe("default");
    expect(element.navigationLabel).toBe("Main");
  });

  // TODO:
});
