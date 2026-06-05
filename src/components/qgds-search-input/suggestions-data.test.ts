import { describe, expect, it, vi } from "vitest";
import { normalizeSuggestions, parseSuggestionsAttribute } from "./suggestions-data";

describe("normalizeSuggestions", () => {
  it("returns [] for non-array input", () => {
    expect(normalizeSuggestions(null)).toEqual([]);
    expect(normalizeSuggestions(undefined)).toEqual([]);
    expect(normalizeSuggestions("nope")).toEqual([]);
    expect(normalizeSuggestions({ items: [] })).toEqual([]);
  });

  it("defaults the group type to 'suggestion' and honours 'autocomplete'", () => {
    const result = normalizeSuggestions([
      { items: [{ label: "a" }] },
      { type: "autocomplete", items: [{ label: "b" }] },
      { type: "nonsense", items: [{ label: "c" }] },
    ]);
    expect(result.map((g) => g.type)).toEqual(["suggestion", "autocomplete", "suggestion"]);
  });

  it("keeps well-formed groups and items, coercing booleans/strings", () => {
    const result = normalizeSuggestions([
      {
        type: "suggestion",
        heading: "Related services",
        feature: true,
        viewMoreUrl: "/search?q=x",
        items: [
          { label: "Camping permits", href: "/permits", icon: "arrow-right" },
          { label: "Find a school", icon: "search" },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        type: "suggestion",
        heading: "Related services",
        feature: true,
        viewMoreUrl: "/search?q=x",
        viewMoreLabel: undefined,
        items: [
          { label: "Camping permits", href: "/permits", icon: "arrow-right" },
          { label: "Find a school", href: undefined, icon: "search" },
        ],
      },
    ]);
  });

  it("drops items without a string label and unknown icons", () => {
    const result = normalizeSuggestions([
      {
        items: [
          { label: "Valid" },
          { label: 123 },
          { href: "/no-label" },
          { label: "Bad icon", icon: "rocket" },
        ],
      },
    ]);

    expect(result[0].items).toEqual([
      { label: "Valid", href: undefined, icon: undefined },
      { label: "Bad icon", href: undefined, icon: undefined },
    ]);
  });

  it("discards groups that end up with no valid items", () => {
    const result = normalizeSuggestions([
      { heading: "Empty", items: [] },
      { heading: "Empty too", items: [{ href: "/x" }] },
      { heading: "Has one", items: [{ label: "Keep" }] },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].heading).toBe("Has one");
  });
});

describe("parseSuggestionsAttribute", () => {
  it("returns null for an empty or missing attribute", () => {
    expect(parseSuggestionsAttribute(null)).toBeNull();
    expect(parseSuggestionsAttribute("")).toBeNull();
    expect(parseSuggestionsAttribute("   ")).toBeNull();
  });

  it("parses and normalises a valid JSON array", () => {
    const result = parseSuggestionsAttribute('[{"type":"autocomplete","items":[{"label":"Camping"}]}]');
    expect(result).toEqual([
      {
        type: "autocomplete",
        heading: undefined,
        feature: false,
        viewMoreUrl: undefined,
        viewMoreLabel: undefined,
        items: [{ label: "Camping", href: undefined, icon: undefined }],
      },
    ]);
  });

  it("returns [] and warns for malformed JSON", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(parseSuggestionsAttribute("{not json")).toEqual([]);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});
