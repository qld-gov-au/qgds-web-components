// write a test suite same as qgds-iunput-text.test.ts but for qgds-textarea
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-textarea";
import { QGDSTextarea } from "./qgds-textarea";

describe("qgds-textarea", () => {
  let element: QGDSTextarea;

  beforeEach(() => {
    element = document.createElement("qgds-textarea");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render as an error if id is missing", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;
    expect(element.shadowRoot?.children.length).toEqual(1);
    expect(element.shadowRoot?.children[0].outerHTML).toBe(
      '<p style="color: red;">Error: id attribute is required</p>'
    );
  });

  it("if id is provided, it should render with a textarea element, with the id forwarded to the textarea", async () => {
    element.id = "my-id";
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('textarea[id="my-id"]')).not.toBeNull();
  });
});
