import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { html } from "lit";
import { chromaticModes } from "../../../.storybook/modes";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSSearchInput, tagName, type SuggestionGroupData } from "./qgds-search-input";
import "./qgds-search-input";
import { ifDefined } from "lit/directives/if-defined.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSSearchInput>(tagName);

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Search input",
  component: tagName,
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => html`
    <div
      @qgds-search=${(e: CustomEvent) => {
        action("qgds-search")(e.detail);
      }}
    >
      ${template(args)}
    </div>
  `,
};

export default meta;

export const Default: Story = {
  args: {
    ...args,
    placeholder: "Search",
  },
};

export const Filled: Story = {
  args: {
    ...Default.args,
    variant: "filled",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const AllVariants: Story = {
  parameters: {
    ...chromaticModes,
  },
  decorators: [
    (story) => {
      return html`<div>
        <style>
          qgds-search-input:not(:last-child) {
            margin-bottom: 20px;
          }
        </style>
        ${story()}
      </div>`;
    },
  ],
  render: (args) => {
    return html`
      <qgds-search-input placeholder="${ifDefined(args.placeholder)}" variant="outlined"> </qgds-search-input>

      <qgds-search-input placeholder="${ifDefined(args.placeholder)}" variant="filled"> </qgds-search-input>
    `;
  },
  args: {
    ...Default.args,
  },
};

// ── Suggestions dropdown ──────────────────────────────────────────────────────

interface MockService {
  title: string;
  href: string;
}

/** A tiny in-memory index standing in for a real suggestions/search API. */
const MOCK_QUERIES = [
  "camping permits",
  "camping in national parks",
  "car registration renewal",
  "change of address",
  "school enrolment",
  "school holidays",
  "working with children check",
];

const MOCK_SERVICES: MockService[] = [
  { title: "Apply for a camping permit", href: "/services/camping-permit" },
  { title: "Renew vehicle registration", href: "/services/rego-renewal" },
  { title: "Find a state school", href: "/services/find-a-school" },
  { title: "Working with children check", href: "/services/blue-card" },
];

interface MockSearchResponse {
  suggestions: string[];
  services: MockService[];
}

/** Mocks an async API returning both query suggestions and related services. */
const mockSearchApi = (query: string): Promise<MockSearchResponse> =>
  new Promise((resolve) => {
    const q = query.trim().toLowerCase();
    if (!q) {
      resolve({ suggestions: [], services: [] });
      return;
    }
    const suggestions = MOCK_QUERIES.filter((item) => item.includes(q)).slice(0, 4);
    const services = MOCK_SERVICES.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 3);
    // Simulate network latency.
    setTimeout(() => resolve({ suggestions, services }), 150);
  });

/**
 * Demonstrates the intended integration pattern, mirroring the BS5
 * `.suggestions.suggestions__group` dropdown:
 * 1. Listen for `qgds-input`.
 * 2. Call your own API (mocked here).
 * 3. Inject `<qgds-search-suggestion-group>` / `<qgds-search-suggestion>` into the
 *    `suggestions` slot. A "Related services" group uses the `feature` treatment.
 *
 * The component shows/hides the dropdown automatically based on focus + slot content.
 */
export const WithSuggestions: Story = {
  args: {
    ...Default.args,
    placeholder: "Search Queensland Government",
    // Wait for a 300ms pause in typing before looking up suggestions.
    debounce: 300,
  },
  parameters: {
    // Async, interaction-driven — not a meaningful static snapshot.
    chromatic: { disableSnapshot: true },
  },
  render: (args) => {
    const clearSuggestions = (el: QGDSSearchInput) =>
      el.querySelectorAll('[slot="suggestions"]').forEach((node) => node.remove());

    const onInput = async (e: Event) => {
      const el = e.currentTarget as QGDSSearchInput;
      const { value } = (e as CustomEvent<{ value: string }>).detail;
      action("qgds-input")(value);

      const { suggestions, services } = await mockSearchApi(value);
      clearSuggestions(el);
      if (suggestions.length === 0 && services.length === 0) return;

      // Autocomplete group — query completions with no href. The component fills
      // the field and fires qgds-search when one is chosen; no wiring needed here.
      if (suggestions.length > 0) {
        const group = document.createElement("qgds-search-suggestion-group");
        group.setAttribute("slot", "suggestions");
        group.type = "autocomplete";
        suggestions.forEach((text) => {
          const item = document.createElement("qgds-search-suggestion");
          item.label = text;
          group.appendChild(item);
        });
        el.appendChild(group);
      }

      // Suggestion group — featured "Related services" with real destination links.
      if (services.length > 0) {
        const group = document.createElement("qgds-search-suggestion-group");
        group.setAttribute("slot", "suggestions");
        group.heading = "Related services";
        group.feature = true;
        group.viewMoreUrl = `/search?q=${encodeURIComponent(value)}`;
        services.forEach((service) => {
          const item = document.createElement("qgds-search-suggestion");
          item.label = service.title;
          item.href = service.href;
          item.target = "_blank"; // open service pages in a new tab
          group.appendChild(item);
        });
        el.appendChild(group);
      }
    };

    return html`
      <qgds-search-input
        placeholder="${ifDefined(args.placeholder)}"
        debounce=${ifDefined(args.debounce)}
        @qgds-input=${onInput}
        @qgds-search=${(e: CustomEvent) => {
          action("qgds-search")(e.detail);
        }}
      ></qgds-search-input>
      <p style="margin-top: 1rem; color: #636363;">Try typing "camping", "car", or "school".</p>
    `;
  },
};

/**
 * Data-driven via the `suggestions` JSON-string attribute, with two mocked API
 * responses driving the dropdown:
 * - **On focus** (empty field) → JSON with two `suggestion` groups (popular
 *   services + categories) — navigating links.
 * - **While typing** → JSON with one `autocomplete` group of query completions
 *   that fill the field and run a search on click.
 *
 * The component parses + validates the JSON each time the attribute is set.
 */
export const SuggestionsFromJson: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: () => {
    // Mock API #1 — default suggestions shown on focus: two "suggestion" groups
    // of navigating links (popular services + categories).
    const fetchDefaultSuggestions = (): Promise<string> =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              JSON.stringify([
                {
                  type: "suggestion",
                  heading: "Popular services",
                  feature: true,
                  items: [
                    { label: "Renew vehicle registration", href: "/services/rego", target: "_blank" },
                    { label: "Apply for a birth certificate", href: "/services/birth-certificate", target: "_blank" },
                    { label: "Find a school", href: "/services/find-a-school" },
                  ],
                },
                {
                  type: "suggestion",
                  heading: "Browse categories",
                  feature: true,
                  viewMoreUrl: "/categories",
                  items: [
                    { label: "Transport and motoring", href: "/categories/transport" },
                    { label: "Education and training", href: "/categories/education" },
                  ],
                },
              ] satisfies SuggestionGroupData[])
            ),
          150
        )
      );

    // Mock API #2 — shown while typing: an "autocomplete" group of query
    // completions (no href; fills the field + searches on click), with a
    // "suggestion" group of matching related services appended after it.
    const fetchAutocomplete = (query: string): Promise<string> =>
      new Promise((resolve) => {
        const q = query.trim().toLowerCase();
        const matches = MOCK_QUERIES.filter((text) => text.includes(q)).slice(0, 5);
        const services = MOCK_SERVICES.filter((s) => s.title.toLowerCase().includes(q)).slice(0, 3);

        const json: SuggestionGroupData[] = [];
        if (matches.length) {
          json.push({ type: "autocomplete", items: matches.map((label) => ({ label })) });
        }
        if (services.length) {
          json.push({
            type: "suggestion",
            heading: "Related services",
            feature: true,
            viewMoreUrl: `/search?q=${encodeURIComponent(query)}`,
            items: services.map((s) => ({ label: s.title, href: s.href })),
          });
        }
        setTimeout(() => resolve(JSON.stringify(json)), 150);
      });

    const applyJson = (el: QGDSSearchInput, json: string) => el.setAttribute("suggestions", json);

    // On focus with an empty field → default suggestions.
    const onFocus = async (e: Event) => {
      const el = e.currentTarget as QGDSSearchInput;
      if (el.value.trim()) return;
      applyJson(el, await fetchDefaultSuggestions());
    };

    // On typing → autocomplete; clearing the field falls back to default suggestions.
    const onInput = async (e: Event) => {
      const el = e.currentTarget as QGDSSearchInput;
      const { value } = (e as CustomEvent<{ value: string }>).detail;
      action("qgds-input")(value);
      applyJson(el, value.trim() ? await fetchAutocomplete(value) : await fetchDefaultSuggestions());
    };

    return html`
      <qgds-search-input
        placeholder="Search Queensland Government"
        debounce="300"
        @focusin=${onFocus}
        @qgds-input=${onInput}
        @qgds-search=${(e: CustomEvent) => {
          action("qgds-search")(e.detail);
        }}
      ></qgds-search-input>
      <p style="margin-top: 1rem; color: #636363;">
        Focus the empty field for popular services; start typing (e.g. "camping", "school") for autocomplete.
      </p>
    `;
  },
};

/** Static view of the dropdown contents for visual review (panel forced open). */
export const SuggestionsLayout: Story = {
  parameters: {
    ...chromaticModes,
  },
  render: () => html`
    <qgds-search-suggestion-group type="autocomplete">
      <qgds-search-suggestion label="camping permits"></qgds-search-suggestion>
      <qgds-search-suggestion label="camping in national parks"></qgds-search-suggestion>
    </qgds-search-suggestion-group>
    <qgds-search-suggestion-group heading="Related services" feature view-more-url="/search?q=camping">
      <qgds-search-suggestion label="Apply for a camping permit" href="#" target="_blank"></qgds-search-suggestion>
      <qgds-search-suggestion label="Find a national park" href="#" target="_self"></qgds-search-suggestion>
    </qgds-search-suggestion-group>
  `,
};
