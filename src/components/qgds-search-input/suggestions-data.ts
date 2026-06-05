import type { SuggestionIcon } from "../qgds-search-suggestion/qgds-search-suggestion.js";

/** A single suggestion item, as supplied via the `suggestions` JSON. */
export interface SuggestionItemData {
  label: string;
  href?: string;
  icon?: SuggestionIcon;
}

/** A titled group of suggestions, as supplied via the `suggestions` JSON. */
export interface SuggestionGroupData {
  heading?: string;
  feature?: boolean;
  viewMoreUrl?: string;
  viewMoreLabel?: string;
  items: SuggestionItemData[];
}

const SUGGESTION_ICONS: readonly SuggestionIcon[] = ["arrow-right", "search", "clock"];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);

const asIcon = (value: unknown): SuggestionIcon | undefined =>
  SUGGESTION_ICONS.includes(value as SuggestionIcon) ? (value as SuggestionIcon) : undefined;

/**
 * Defensively validate and normalise loosely-typed input (e.g. a parsed JSON
 * attribute or an API response) into well-formed `SuggestionGroupData[]`.
 *
 * Anything that does not match the expected shape is dropped rather than thrown:
 * non-arrays become `[]`, items without a string `label` are removed, unknown
 * icons fall back to the component default, and empty groups are discarded.
 */
export function normalizeSuggestions(input: unknown): SuggestionGroupData[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter(isRecord)
    .map((group): SuggestionGroupData => {
      const rawItems = Array.isArray(group.items) ? group.items : [];
      const items = rawItems
        .filter(isRecord)
        .map((item): SuggestionItemData | null => {
          const label = asString(item.label);
          if (!label) return null;
          return { label, href: asString(item.href), icon: asIcon(item.icon) };
        })
        .filter((item): item is SuggestionItemData => item !== null);

      return {
        heading: asString(group.heading),
        feature: group.feature === true,
        viewMoreUrl: asString(group.viewMoreUrl),
        viewMoreLabel: asString(group.viewMoreLabel),
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}

/**
 * Safely parse the `suggestions` attribute. Returns `null` (i.e. "not provided")
 * for an empty/missing attribute and `[]` for malformed JSON, after warning.
 */
export function parseSuggestionsAttribute(value: string | null): SuggestionGroupData[] | null {
  if (value === null || value.trim() === "") return null;
  try {
    return normalizeSuggestions(JSON.parse(value));
  } catch {
    console.warn("qgds-search-input: `suggestions` attribute is not valid JSON; ignoring.");
    return [];
  }
}
