import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { type QGDSNavigation } from "./qgds-navigation";
import { type QGDSNavigationItem } from "./qgds-navigation-item";
import "../qgds-navigation/qgds-navigation";
import "../qgds-navigation/qgds-navigation-item";

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

  it("syncs slotted items into the active orientation and list item roles", async () => {
    element.innerHTML = `
      <qgds-navigation-item label="Home" href="/home"></qgds-navigation-item>
      <qgds-navigation-item label="Services" href="/services"></qgds-navigation-item>
    `;

    await element.updateComplete;

    const items = [...element.children] as QGDSNavigationItem[];
    await Promise.all(items.map((item) => item.updateComplete));

    expect(items).toHaveLength(2);
    items.forEach((item) => {
      expect(["horizontal", "vertical"]).toContain(item.variant);
      expect(item.getAttribute("role")).toBe("listitem");
    });
  });
});

describe("qgds-navigation-item", () => {
  let element: QGDSNavigationItem;

  beforeEach(() => {
    element = document.createElement("qgds-navigation-item");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders a single horizontal item as an anchor with the provided href and label", async () => {
    element.label = "Home";
    element.href = "/home";

    await element.updateComplete;

    const anchor = element.shadowRoot?.querySelector<HTMLAnchorElement>("a.nav-item-link");
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute("href")).toBe("/home");
    expect(anchor?.textContent?.trim()).toContain("Home");
  });

  it("dispatches qgds-open and qgds-close when its open state changes", async () => {
    const openSpy = vi.fn();
    const closeSpy = vi.fn();

    element.label = "Services";
    element.href = "/services";
    element.innerHTML = `<qgds-navigation-item label="Planning" href="/planning"></qgds-navigation-item>`;

    element.addEventListener("qgds-open", openSpy);
    element.addEventListener("qgds-close", closeSpy);

    await element.updateComplete;

    element.isOpen = true;
    await element.updateComplete;

    expect(openSpy).toHaveBeenCalled();
    expect(
      element.shadowRoot?.querySelector<HTMLButtonElement>("button.nav-item-link")?.getAttribute("aria-expanded")
    ).toBe("true");

    element.isOpen = false;
    await element.updateComplete;

    expect(closeSpy).toHaveBeenCalled();
  });

  it("promotes nested navigation items to level 2 and keeps their role metadata", async () => {
    element.label = "Services";
    element.href = "/services";
    element.innerHTML = `<qgds-navigation-item label="Planning" href="/planning"></qgds-navigation-item>`;

    await element.updateComplete;

    const child = element.querySelector("qgds-navigation-item");
    await child?.updateComplete;

    expect(child).not.toBeNull();
    expect(child?.level).toBe(2);
    expect(child?.getAttribute("role")).toBe("listitem");
  });
});
