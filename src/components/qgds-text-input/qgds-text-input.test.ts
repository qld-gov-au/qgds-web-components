import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-text-input";
import { QGDSTextInput } from "./qgds-text-input";

describe("qgds-text-input", () => {
  let element: QGDSTextInput;

  beforeEach(() => {
    element = document.createElement("qgds-text-input");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render as an error if id is missing", async () => {
    // Wait for the component to complete its first render
    await element.updateComplete;
    expect(element.shadowRoot?.children.length).toEqual(1); //   getHTML()).toBe('<p style="color: red;">Error: id attribute is required</p>');
    expect(element.shadowRoot?.children[0].outerHTML).toBe(
      '<p style="color: red;">Error: id attribute is required</p>'
    );
  });

  it("if id is provided, it should render with an input element, with the id forwarded to the input", async () => {
    element.id = "my-id";
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('input[id="my-id"]')).not.toBeNull();
  });
});
