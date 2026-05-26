import { afterEach, beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import "./qgds-tabs";
import type { QGDSTabs } from "./qgds-tabs";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("qgds-tabs", () => {
  let element: QGDSTabs;

  beforeEach(() => {
    element = document.createElement("qgds-tabs");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("registers the custom element", () => {
    expect(customElements.get("qgds-tabs")).toBeDefined();
  });

  it("renders tabs from slotted children", async () => {
    element.innerHTML = `
      <div label="Tab 1">Panel 1</div>
      <div label="Tab 2">Panel 2</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.tab-button");

    expect(buttons).toHaveLength(2);
    expect(buttons?.[0].textContent?.trim()).toBe("Tab 1");
    expect(buttons?.[1].textContent?.trim()).toBe("Tab 2");
  });

  it("activates the first tab by default", async () => {
    element.innerHTML = `
      <div label="Tab 1">Panel 1</div>
      <div label="Tab 2">Panel 2</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.tab-button");

    expect(buttons?.[0].getAttribute("aria-selected")).toBe("true");
    expect(buttons?.[1].getAttribute("aria-selected")).toBe("false");
  });

  it("selects a tab when clicked", async () => {
    element.innerHTML = `
      <div label="Tab 1">Panel 1</div>
      <div label="Tab 2">Panel 2</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.tab-button");
    const panels = element.querySelectorAll<HTMLDivElement>("div");

    buttons?.[1].click();
    await element.updateComplete;
    await flush();
    await element.updateComplete;

    expect(buttons?.[1].getAttribute("aria-selected")).toBe("true");
    expect(buttons?.[0].getAttribute("aria-selected")).toBe("false");
    expect(panels[0].hasAttribute("hidden")).toBe(true);
    expect(panels[1].hasAttribute("hidden")).toBe(false);
  });

  it("supports keyboard navigation with ArrowRight and ArrowLeft", async () => {
    const user = userEvent.setup();

    element.innerHTML = `
      <div label="Tab 1">Panel 1</div>
      <div label="Tab 2">Panel 2</div>
      <div label="Tab 3">Panel 3</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.tab-button");
    buttons?.[0].focus();

    await user.keyboard("{ArrowRight}");
    await element.updateComplete;
    await flush();
    await element.updateComplete;

    expect(buttons?.[1].getAttribute("aria-selected")).toBe("true");

    await user.keyboard("{ArrowLeft}");
    await element.updateComplete;
    await flush();
    await element.updateComplete;

    expect(buttons?.[0].getAttribute("aria-selected")).toBe("true");
  });

  it("applies the parent context from parent palette class", async () => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("qgds-palette-deep");
    wrapper.appendChild(element);
    document.body.appendChild(wrapper);

    element.innerHTML = `
      <div label="Tab 1">Panel 1</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    expect(element.parentContext).toBe("deep");

    wrapper.remove();
  });

  it("sets ARIA attributes on panels and tabs", async () => {
    element.innerHTML = `
      <div label="Tab A">Panel A</div>
      <div label="Tab B">Panel B</div>
    `;

    await element.updateComplete;
    await flush();
    await element.updateComplete;

    const buttons = element.shadowRoot?.querySelectorAll<HTMLButtonElement>("button.tab-button");
    const panelA = element.querySelector("div") as HTMLElement;

    expect(buttons?.[0].getAttribute("aria-controls")).toBe("panel-0");
    expect(panelA.getAttribute("aria-labelledby")).toBe("tab-0");
    expect(panelA.getAttribute("role")).toBe("tabpanel");
  });
});
