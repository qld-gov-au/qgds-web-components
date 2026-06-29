import { describe, it, expect, vi } from "vitest";
import { mimeToExtension, readableFileSize } from "../file-type-helpers";

describe("mimeToExtension", () => {
  it("returns extension for known mime types", () => {
    expect(mimeToExtension("image/png")).toBe("png");
    expect(mimeToExtension("application/pdf")).toBe("pdf");
    expect(mimeToExtension("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe("xlsx");
  });

  it("handles +json and +xml suffixes", () => {
    expect(mimeToExtension("application/ld+json")).toBe("json");
    expect(mimeToExtension("application/custom+xml")).toBe("xml");
  });

  it("returns category fallback for video types", () => {
    expect(mimeToExtension("video/unknown")).toBe("video");
  });

  it("returns cleaned mime and logs a warning for unknown types", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {
      /* empty */
    });
    const res = mimeToExtension("application/x-unknown; charset=utf-8");
    expect(res).toBe("application/x-unknown");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("returns the input mime string when empty and warns", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {
      /* empty */
    });
    const res = mimeToExtension("");
    expect(res).toBe("");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("readableFileSize", () => {
  it("returns bytes when size is under 1024", () => {
    expect(readableFileSize(1023)).toBe("1023 bytes");
  });

  it("returns 0 bytes for zero or invalid sizes", () => {
    expect(readableFileSize(0)).toBe("0 bytes");
    expect(readableFileSize(Number.NaN)).toBe("0 bytes");
    expect(readableFileSize(Number.POSITIVE_INFINITY)).toBe("0 bytes");
  });

  it("formats values in kB with up to two decimals", () => {
    expect(readableFileSize(1024)).toBe("1 kB");
    expect(readableFileSize(1230)).toBe("1.2 kB");
    expect(readableFileSize(1500)).toBe("1.46 kB");
  });

  it("formats values in MB and GB correctly", () => {
    expect(readableFileSize(1_234_567)).toBe("1.18 MB");
    expect(readableFileSize(1_234_567_890)).toBe("1.15 GB");
  });
});
