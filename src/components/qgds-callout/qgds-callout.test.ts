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
    expect(element.heading).toBe("Callout headline");
    expect(element.headingLevel).toBe("h3");
    expect(element.content).toBe("This is callout content.");

    // Check that h3 heading is rendered by default
    const heading = element.shadowRoot?.querySelector("h3.headline");
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe("Callout headline");
  });
});
