import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-direction-link";
import "../qgds-link/qgds-link";
import type { QGDSDirectionLink } from "./qgds-direction-link";

describe("qgds-direction-link", () => {
  let element: QGDSDirectionLink;

  beforeEach(() => {
    element = document.createElement("qgds-direction-link");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBe("");
    expect(element.href).toBe("");
    expect(element.direction).toBe("right");
    expect(element.animation).toBe(true);
  });

  it("renders an inner qgds-link", async () => {
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link).toBeTruthy();
  });

  it.each([
    ["up", "arrow-up", "bottomToTop"],
    ["down", "arrow-down", "topToBottom"],
    ["left", "arrow-left", "rightToLeft"],
    ["right", "arrow-right", "leftToRight"],
  ] as const)("maps direction=%s to icon=%s and animation=%s", async (direction, iconName, animation) => {
    element.direction = direction;
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.iconName).toBe(iconName);
    expect(link?.animation).toBe(animation);
  });

  it("passes label and href through to the inner qgds-link", async () => {
    element.label = "Next";
    element.href = "/next";
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.label).toBe("Next");
    expect(link?.href).toBe("/next");
  });

  it.each([
    ["up", true],
    ["down", true],
    ["right", true],
    ["left", false],
  ] as const)("derives trailingIcon for direction=%s → %s", async (direction, trailing) => {
    element.direction = direction;
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    expect(link?.hasTrailingIcon).toBe(trailing);
  });

  it("clears animation on the inner qgds-link when animation=false", async () => {
    element.direction = "right";
    element.animation = false;
    await element.updateComplete;

    const link = element.shadowRoot?.querySelector("qgds-link");
    await link?.updateComplete;
    expect(link?.animation).toBeFalsy();
    expect(link?.hasAttribute("animation")).toBe(false);
  });
});
