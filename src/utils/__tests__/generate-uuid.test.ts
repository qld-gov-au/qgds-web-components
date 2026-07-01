import { describe, expect, it } from "vitest";
import { generateUUID } from "../generate-uuid";

describe("generateUUID", () => {
  it("returns a UUID string in v4 format", () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(generateUUID()).toMatch(uuidRegex);
  });
});
