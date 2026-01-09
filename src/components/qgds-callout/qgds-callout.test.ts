import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-callout";
import type { QGDSCallout } from "./qgds-callout";

describe("qgds-callout", () => {
  let element: QGDSCallout;

  beforeEach(() => {
    element = document.createElement("qgds-callout");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;

    // Verify default property values
    expect(element.headline).toBe("Callout headline");
    expect(element.level).toBe("3");
    expect(element.message).toBe("This is an alert message.");
    expect(element.palette).toBe("");

    // Check that h3 heading is rendered by default
    const heading = element.shadowRoot?.querySelector("h3.headline");
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe("Callout headline");
  });
});
