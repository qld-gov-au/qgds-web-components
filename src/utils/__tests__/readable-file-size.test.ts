import { describe, expect, it } from "vitest";
import { readableFileSize } from "../readable-file-size";

describe("readableFileSize", () => {
  it("returns bytes when size is under 1000", () => {
    expect(readableFileSize(999)).toBe("999 bytes");
  });

  it("returns 0 bytes for zero or invalid sizes", () => {
    expect(readableFileSize(0)).toBe("0 bytes");
    expect(readableFileSize(Number.NaN)).toBe("0 bytes");
    expect(readableFileSize(Number.POSITIVE_INFINITY)).toBe("0 bytes");
  });

  it("formats values in kB with up to two decimals", () => {
    expect(readableFileSize(1000)).toBe("1 kB");
    expect(readableFileSize(1500)).toBe("1.5 kB");
    expect(readableFileSize(1234)).toBe("1.23 kB");
  });

  it("formats values in MB and GB correctly", () => {
    expect(readableFileSize(1_234_567)).toBe("1.23 MB");
    expect(readableFileSize(1_000_000_000)).toBe("1 GB");
  });
});
