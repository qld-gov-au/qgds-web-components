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

  // TODO: expand test suite
});
