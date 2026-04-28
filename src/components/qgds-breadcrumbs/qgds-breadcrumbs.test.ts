import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./qgds-breadcrumbs";
import "./qgds-breadcrumbs-item";

import type { QGDSBreadcrumbs } from "./qgds-breadcrumbs";
import type { QGDSBreadcrumbsItem } from "./qgds-breadcrumbs-item";

const waitForRender = async (element: { updateComplete: Promise<unknown> }) => {
  await element.updateComplete;
  await element.updateComplete;
};

describe("qgds-breadcrumbs", () => {
  let element: QGDSBreadcrumbs;

  beforeEach(() => {
    element = document.createElement("qgds-breadcrumbs");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders with the default aria-label", async () => {
    await waitForRender(element);

    expect(element.label).toBe("breadcrumbs");

    const nav = element.shadowRoot?.querySelector("nav");
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute("aria-label")).toBe("breadcrumbs");
  });

  it("renders breadcrumb items passed as children", async () => {
    element.remove();

    const breadcrumbs = document.createElement("qgds-breadcrumbs");
    const items = [
      { url: "/home", text: "Home" },
      { url: "/services", text: "Services" },
      { url: "", text: "Current page" },
    ];

    items.forEach((item) => {
      const child = document.createElement("qgds-breadcrumbs-item");
      if (item.url) {
        child.setAttribute("url", item.url);
      }
      child.textContent = item.text;
      breadcrumbs.appendChild(child);
    });

    document.body.appendChild(breadcrumbs);
    await waitForRender(breadcrumbs);

    const slot = breadcrumbs.shadowRoot?.querySelector("slot");
    const assignedItems = slot?.assignedElements() as QGDSBreadcrumbsItem[] | undefined;

    expect(assignedItems).toHaveLength(items.length);
    expect(assignedItems?.[2]?.hasAttribute("is-last")).toBe(true);

    breadcrumbs.remove();
  });

  it("collapses breadcrumb items when there are more than five", async () => {
    element.remove();

    const compactElement = document.createElement("qgds-breadcrumbs");
    for (let index = 1; index <= 6; index += 1) {
      const child = document.createElement("qgds-breadcrumbs-item");
      child.setAttribute("url", `/level-${index}`);
      child.textContent = `Level ${index}`;
      compactElement.appendChild(child);
    }

    document.body.appendChild(compactElement);
    await waitForRender(compactElement);

    expect(compactElement.isCollapsed).toBe(true);

    const toggleItem = compactElement.shadowRoot?.querySelector(".breadcrumb-toggle");
    expect(toggleItem).toBeTruthy();

    const renderedItems = compactElement.shadowRoot?.querySelectorAll<QGDSBreadcrumbsItem>("qgds-breadcrumbs-item");
    const insideVerticalItems = Array.from(renderedItems ?? []).filter((item) => item.insideVertical === true);
    const currentPageItem = Array.from(renderedItems ?? []).find((item) => item.hasAttribute("is-last"));

    expect(renderedItems).toHaveLength(7);
    expect(insideVerticalItems).toHaveLength(3);
    expect(currentPageItem?.isLast).toBe(true);

    compactElement.remove();
  });

  it("renders a toggle button with the expected accessible label when collapsed", async () => {
    element.remove();

    const compactElement = document.createElement("qgds-breadcrumbs");
    for (let index = 1; index <= 6; index += 1) {
      const child = document.createElement("qgds-breadcrumbs-item");
      child.setAttribute("url", `/level-${index}`);
      child.textContent = `Level ${index}`;
      compactElement.appendChild(child);
    }

    document.body.appendChild(compactElement);
    await waitForRender(compactElement);

    const toggleButton = compactElement.shadowRoot?.querySelector<HTMLButtonElement>(".breadcrumb-toggle-link");
    expect(toggleButton).toBeTruthy();
    expect(toggleButton?.getAttribute("aria-label")).toBe("Expand breadcrumbs");
    expect(toggleButton?.classList.contains("breadcrumb-toggle-link")).toBe(true);

    compactElement.remove();
  });

  it("expands the collapsed breadcrumb menu when the toggle button is clicked", async () => {
    element.remove();

    const compactElement = document.createElement("qgds-breadcrumbs");
    for (let index = 1; index <= 6; index += 1) {
      const child = document.createElement("qgds-breadcrumbs-item");
      child.setAttribute("url", `/level-${index}`);
      child.textContent = `Level ${index}`;
      compactElement.appendChild(child);
    }

    document.body.appendChild(compactElement);
    await waitForRender(compactElement);

    const toggleItem = compactElement.shadowRoot?.querySelector<HTMLElement>(".breadcrumb-toggle");
    const toggleButton = compactElement.shadowRoot?.querySelector<HTMLButtonElement>(".breadcrumb-toggle-link");

    expect(toggleItem?.classList.contains("expanded")).toBe(false);
    toggleButton?.click();
    await waitForRender(compactElement);

    expect(toggleItem?.classList.contains("expanded")).toBe(true);

    compactElement.remove();
  });

  it("collapses an expanded breadcrumb menu when clicking outside", async () => {
    element.remove();

    const compactElement = document.createElement("qgds-breadcrumbs");
    for (let index = 1; index <= 6; index += 1) {
      const child = document.createElement("qgds-breadcrumbs-item");
      child.setAttribute("url", `/level-${index}`);
      child.textContent = `Level ${index}`;
      compactElement.appendChild(child);
    }

    document.body.appendChild(compactElement);
    await waitForRender(compactElement);

    const toggleButton = compactElement.shadowRoot?.querySelector<HTMLButtonElement>(".breadcrumb-toggle-link");

    toggleButton?.click();
    await waitForRender(compactElement);

    let toggleItem = compactElement.shadowRoot?.querySelector<HTMLElement>(".breadcrumb-toggle");
    expect(toggleItem?.classList.contains("expanded")).toBe(true);

    document.body.click();
    await waitForRender(compactElement);

    toggleItem = compactElement.shadowRoot?.querySelector<HTMLElement>(".breadcrumb-toggle");
    expect(toggleItem?.classList.contains("expanded")).toBe(false);

    compactElement.remove();
  });
});

describe("qgds-breadcrumbs-item", () => {
  let element: QGDSBreadcrumbsItem;

  beforeEach(() => {
    element = document.createElement("qgds-breadcrumbs-item");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("sets list semantics and renders a link when url is provided", async () => {
    element.setAttribute("url", "/about");
    element.textContent = "About";
    await waitForRender(element);

    expect(element.getAttribute("role")).toBe("listitem");
    expect(element.tabIndex).toBe(0);

    const anchor = element.shadowRoot?.querySelector("a");
    const slot = anchor?.querySelector("slot");
    const slottedText = slot
      ?.assignedNodes()
      .map((node) => node.textContent?.trim() ?? "")
      .join("");

    expect(anchor).toBeTruthy();
    expect(anchor?.getAttribute("href")).toBe("/about");
    expect(slottedText).toBe("About");
  });

  it("renders the current page without a link when is-last is true", async () => {
    element.isLast = true;
    element.setAttribute("url", "/current");
    element.textContent = "Current page";
    await waitForRender(element);

    const listItem = element.shadowRoot?.querySelector("div.breadcrumbs-item");
    const anchor = element.shadowRoot?.querySelector("a");
    const slot = listItem?.querySelector("slot");
    const slottedText = slot
      ?.assignedNodes()
      .map((node) => node.textContent?.trim() ?? "")
      .join("");

    expect(listItem?.getAttribute("aria-current")).toBe("page");
    expect(anchor).toBeNull();
    expect(slottedText).toBe("Current page");
  });
});
