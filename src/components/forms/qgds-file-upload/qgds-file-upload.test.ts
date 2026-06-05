import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "./qgds-file-upload";
import { QGDSFileUpload, tagname } from "./qgds-file-upload";

describe(tagname, () => {
  let element: QGDSFileUpload;

  beforeEach(() => {
    element = document.createElement(tagname);
    element.id = "test";
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should render with default properties", async () => {
    await element.updateComplete;

    expect(element.label).toBeUndefined();
    expect(element.disabled).toBe(false);
    expect(element.required).toBe(false);
    expect(element.multiple).toBe(false);
    expect(element.autofocus).toBe(false);
    expect(element.value).toBe("");
  });

  it("should render label correctly", async () => {
    element.label = "Choose an option";
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector("label");
    expect(label?.textContent?.trim()).toContain("Choose an option");
  });

  it("should render hint text when provided", async () => {
    element.hint = "This is a hint";
    await element.updateComplete;

    const hint = element.shadowRoot?.querySelector(".qgds-form-hint");
    expect(hint?.textContent).toBe("This is a hint");
  });

  it("should render optional indicator if specified", async () => {
    element.label = "Label";
    element.indicateIf = "optional";
    await element.updateComplete;

    const optional = element.shadowRoot?.querySelector(".qgds-form-label-optional");
    expect(optional?.textContent?.trim()).toContain("(optional)");
  });

  it("should show required indicator when required", async () => {
    element.label = "Label";
    element.required = true;
    await element.updateComplete;

    const required = element.shadowRoot?.querySelector(".qgds-form-label-required");
    expect(required).toBeTruthy();
    expect(required?.textContent).toContain("*");
  });

  // should display acceptable file types from accept parameter, evaluating from mime type if possible

  // should remove the dropzone element if file max is reached

  // should remove File from list if remove button is clicked.
});
