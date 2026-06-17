import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { QGDSFileUpload, tagname } from "./qgds-file-upload";
import { QGDSFileUploadItem } from "./qgds-file-upload-item";
import { audioFile, csvFile, imageFile, pdfFile, textFile, videoFile, wordFile } from "./__mocks__/filemocks";

const addFilesToInput = async (element: QGDSFileUpload, files: File[]) => {
  const input = element.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement | null;

  if (!input) {
    throw new Error("File input not found");
  }

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));

  Object.defineProperty(input, "files", {
    configurable: true,
    value: dataTransfer.files,
  });

  input.dispatchEvent(new Event("change", { bubbles: true }));
  await element.updateComplete;
};

describe("qgds-file-upload", () => {
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

  it("should display acceptable file types from the accept attribute", async () => {
    const expectedAccept = "image/*,.pdf";
    const expectedCaption = "You can upload image, pdf files.";

    element.accept = expectedAccept;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement | null;
    expect(input?.accept).toBe(expectedAccept);

    const caption = element.shadowRoot?.querySelector(".qgds-caption")?.textContent?.trim();
    expect(caption).toBe(expectedCaption);
  });

  it("should display text describing the maximum number of files", async () => {
    element.maxFiles = 3;
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain("You can upload up to 3 files.");
  });

  it("should remove the dropzone once the file limit is reached", async () => {
    element.maxFiles = 1;
    await element.updateComplete;

    await addFilesToInput(element, [textFile]);

    expect(element.filesArray).toHaveLength(1);
    expect(element.shadowRoot?.querySelector(".file-upload-dropzone")).toBeNull();
  });

  it("should remove a file from the list when the remove button is clicked", async () => {
    await addFilesToInput(element, [textFile]);

    const item = element.shadowRoot?.querySelector("qgds-file-upload-item") as QGDSFileUploadItem | null;
    expect(item).toBeTruthy();

    const button = item?.shadowRoot?.querySelector("qgds-button") as HTMLElement | null;
    const actualButton = button?.shadowRoot?.querySelector("button") as HTMLButtonElement | null;

    actualButton?.click();
    await element.updateComplete;

    expect(element.shadowRoot?.querySelectorAll("qgds-file-upload-item")).toHaveLength(0);
  });

  it("should keep the field invalid when the required file input has no files", async () => {
    element.required = true;
    await element.updateComplete;

    expect(element.checkValidity()).toBe(false);
    expect(element.reportValidity()).toBe(false);
    expect(element.validationMessage).toBe("Please select at least one file.");
  });

  it("should show the correct message when uploaded files are rejected by accept rules or file size", async () => {
    element.required = true;
    element.accept = "image/*";
    element.maxSize = 0.001;
    await element.updateComplete;

    const invalidTypeFile = new File(["content"], "invalid.txt", { type: "text/plain" });
    const oversizedFile = new File(["content"], "oversized.png", { type: "image/png" });
    Object.defineProperty(oversizedFile, "size", {
      configurable: true,
      value: 2 * 1024 * 1024,
    });

    await addFilesToInput(element, [invalidTypeFile, oversizedFile]);

    expect(element.checkValidity()).toBe(false);
    expect(element.reportValidity()).toBe(false);
    expect(element.validationMessage).toBe("Please remove invalid files before continuing.");
  });

  it("should prevent drag and drop when the component is disabled", async () => {
    element.disabled = true;
    await element.updateComplete;

    const dropzone = element.shadowRoot?.querySelector(".file-upload-dropzone");
    const dropEvent = new Event("drop", { bubbles: true, cancelable: true });

    Object.defineProperty(dropEvent, "dataTransfer", {
      configurable: true,
      value: {
        files: [textFile],
        dropEffect: "copy",
      },
    });

    dropzone?.dispatchEvent(dropEvent);
    await element.updateComplete;

    expect(element.filesArray).toHaveLength(0);
  });

  it("should disable the upload button when the component is disabled", async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input[type="file"]') as HTMLInputElement | null;
    const button = element.shadowRoot?.querySelector("qgds-button") as HTMLElement | null;
    const actualButton = button?.shadowRoot?.querySelector("button") as HTMLButtonElement | null;

    expect(input?.disabled).toBe(true);
    expect(button?.hasAttribute("disabled")).toBe(true);
    expect(actualButton?.disabled).toBe(true);
  });
});

describe("qgds-file-upload-item", () => {
  let element: QGDSFileUploadItem;

  beforeEach(async () => {
    element = document.createElement("qgds-file-upload-item");
    element.id = "test";
    element.file = textFile;
    element.status = "ready";
    element.message = "Ready to upload";
    document.body.appendChild(element);
    await element.updateComplete;
  });

  afterEach(() => {
    element.remove();
  });

  it("should display the correct icon for each supported file type", async () => {
    const cases = [
      { file: audioFile, expectedIcon: "audio" },
      { file: imageFile, expectedIcon: "image" },
      { file: pdfFile, expectedIcon: "document-pdf" },
      { file: csvFile, expectedIcon: "document-spreadsheet" },
      { file: textFile, expectedIcon: "document" },
      { file: videoFile, expectedIcon: "video" },
      { file: wordFile, expectedIcon: "document-word" },
    ];

    for (const { file, expectedIcon } of cases) {
      element.file = file;
      element.status = "ready";
      element.message = "Ready to upload";
      await element.updateComplete;

      const icon = element.shadowRoot?.querySelector("qgds-icon");
      expect(icon?.getAttribute("icon-id")).toBe(expectedIcon);
    }
  });

  it("should fire a cancel event when the button is clicked", () => {
    const cancelSpy = vi.fn();
    element.addEventListener("qgds-cancel", cancelSpy);

    const button = element.shadowRoot?.querySelector("qgds-button") as HTMLElement | null;
    const actualButton = button?.shadowRoot?.querySelector("button") as HTMLButtonElement | null;

    actualButton?.click();

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });
});
