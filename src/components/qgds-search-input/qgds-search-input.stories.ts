import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { html } from "lit";
import { chromaticModes } from "../../../.storybook/modes";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSSearchInput, tagName } from "./qgds-search-input";
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

      // Query suggestions — magnifier icon, fill the field on click.
      if (suggestions.length > 0) {
        const group = document.createElement("qgds-search-suggestion-group");
        group.setAttribute("slot", "suggestions");
        suggestions.forEach((text) => {
          const item = document.createElement("qgds-search-suggestion");
          item.icon = "search";
          item.label = text;
          item.href = "#";
          item.addEventListener("click", (ev) => {
            ev.preventDefault();
            el.value = text;
            clearSuggestions(el);
            action("qgds-search")(text);
          });
          group.appendChild(item);
        });
        el.appendChild(group);
      }

      // Related services — featured group with real destination links + view-more.
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

/** Static view of the dropdown contents for visual review (panel forced open). */
export const SuggestionsLayout: Story = {
  parameters: {
    ...chromaticModes,
  },
  render: () => html`
    <qgds-search-suggestion-group>
      <qgds-search-suggestion icon="search" label="camping permits"></qgds-search-suggestion>
      <qgds-search-suggestion icon="search" label="camping in national parks"></qgds-search-suggestion>
    </qgds-search-suggestion-group>
    <qgds-search-suggestion-group heading="Related services" feature view-more-url="/search?q=camping">
      <qgds-search-suggestion label="Apply for a camping permit" href="#"></qgds-search-suggestion>
      <qgds-search-suggestion label="Find a national park" href="#"></qgds-search-suggestion>
    </qgds-search-suggestion-group>
  `,
};
