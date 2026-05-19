import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LitElement } from "lit";
import "./qgds-side-navigation";
import "./qgds-side-navigation-item";
import type { QGDSSideNavigation } from "./qgds-side-navigation";
import { LG } from "../../styles/qgds-tokens/qgds-breakpoint";

const isLitElement = (value: unknown): value is LitElement => value instanceof LitElement;

const waitForSideNavigationItems = async (host: HTMLElement) => {
  const items = [...host.querySelectorAll("qgds-side-navigation-item")];
  await Promise.all(items.filter(isLitElement).map((item) => item.updateComplete));
};

describe("qgds-side-navigation", () => {
  let element: QGDSSideNavigation;

  beforeEach(() => {
    element = document.createElement("qgds-side-navigation");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should set role=navigation on connect", async () => {
    await element.updateComplete;
    expect(element.getAttribute("role")).toBe("navigation");
  });

  it("renders a heading slot inside an h2", async () => {
    element.innerHTML = `<qgds-side-navigation-item slot="heading" href="/heading" label="Heading"></qgds-side-navigation-item>`;
    await element.updateComplete;
    await waitForSideNavigationItems(element);

    const heading = element.shadowRoot?.querySelector("h2");
    const slot = heading?.querySelector("slot");
    expect(heading).not.toBeNull();
    expect(slot).not.toBeNull();
    expect(slot?.assignedNodes().length).toBe(1);
  });

  it("marks the first slotted navigation item as first", async () => {
    element.innerHTML = `
      <qgds-side-navigation-item href="/first" label="First"></qgds-side-navigation-item>
      <qgds-side-navigation-item href="/second" label="Second"></qgds-side-navigation-item>
    `;
    await element.updateComplete;
    await waitForSideNavigationItems(element);

    const items = element.querySelectorAll("qgds-side-navigation-item");
    expect(items.length).toBe(2);
    expect(items[0].isFirst).toBe(true);
    expect(items[1].isFirst).toBe(false);
  });

  it("responds to window resize and renders mobile accordion markup", async () => {
    const originalWidth = window.innerWidth;
    window.innerWidth = LG - 1;

    window.dispatchEvent(new Event("resize"));
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(element.shadowRoot?.querySelector("qgds-accordion")).not.toBeNull();

    window.innerWidth = LG;
    window.dispatchEvent(new Event("resize"));
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(element.shadowRoot?.querySelector("qgds-accordion")).toBeNull();

    window.innerWidth = originalWidth;
  });
});
