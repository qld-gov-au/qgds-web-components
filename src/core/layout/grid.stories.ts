import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

const oneToTwelve = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const columnAutoOptions = ["auto-fill", "auto-fit"] as const;
const columnCountOptions = [0, ...oneToTwelve, ...columnAutoOptions] as const;

interface Args {
  itemCount: number;
  itemSpan: (typeof oneToTwelve)[number];
  columnCount?: (typeof columnCountOptions)[number];
  columnMin?: number;
  // gutterWidth?: number;
}

const meta = {
  title: "Core styles/Layout/Grid",
  component: "grid",
  tags: ["!dev"],
  parameters: {
    docs: {
      toc: {
        disable: false,
      },
    },
  },
  args: {
    columnCount: undefined,
    columnMin: 5,
    itemCount: 12,
    itemSpan: 1,
    // gutterWidth: 32,
  },
  argTypes: {
    columnCount: {
      name: "Column count",
      options: columnCountOptions,
      table: { category: "Parent options" },
    },
    columnMin: {
      name: "Column min-width",
      table: { category: "Parent options" },
    },
    itemCount: {
      name: "Item count",
      description: "The number of items (for display only)",
      control: "number",
      table: { category: "Child options" },
    },
    itemSpan: {
      name: "Item span",
      control: "number",
      table: { category: "Child options" },
    },
  },
  render: (args) => {
    const columnMinInlineStyle =
      args.columnMin && (args.columnCount === "auto-fill" || args.columnCount === "auto-fit")
        ? `--qgds-col-min: ${args.columnMin}rem;`
        : undefined;
    return html`<div
      class="qgds-cols ${classMap({ [`qgds-cols-${args.columnCount}`]: args.columnCount !== undefined })}"
      style=${ifDefined(columnMinInlineStyle)}
    >
      ${map(range(args.itemCount), (i) => {
        // prettier-ignore
        return html`<div class=${ifDefined(args.itemSpan > 1 ? `qgds-span-${args.itemSpan}` : undefined )} >Item ${i + 1}</div>\n      `;
      })}
    </div>`;
  },

  decorators: [
    (story) =>
      html` <style>
          .qgds-cols > div {
            background-color: color-mix(#005eb8, transparent 85%);

            padding: 8px;
            text-align: center;
          }

          .sbdocs-content {
            display: grid;
            grid-template-columns: 1fr min(100%, 1000px) 1fr;
            grid-template-areas: ". content .";
            max-width: unset;
          }

          .sbdocs-content > * {
            grid-column: content;
          }

          .sbdocs-preview,
          .sbdocs-preview-actions {
            grid-column: 1 / -1;
          }

          .sbdocs-preview-actions {
            margin-bottom: 0;
          }
        </style>
        ${story()}`,
  ],
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

/**
 * Simply apply class `qgds-cols` to create a mobile-first responsive layout grid. This will default to 4 columns at smallest breakpoint, 6 at medium and 12 on large screens.
 * For each child, specify the number of columns it spans with class `qgds-span-{x}`.
 */
export const Default: Story = {
  render: () => {
    return html`<div class="qgds-cols">
      <div class="qgds-span-1">span-1</div>
      <div class="qgds-span-11">span-11</div>
      <div class="qgds-span-2">span-2</div>
      <div class="qgds-span-10">span-10</div>
      <div class="qgds-span-3">span-3</div>
      <div class="qgds-span-9">span-9</div>
      <div class="qgds-span-4">span-4</div>
      <div class="qgds-span-8">span-8</div>
      <div class="qgds-span-5">span-5</div>
      <div class="qgds-span-7">span-7</div>
      <div class="qgds-span-6">span-6</div>
      <div class="qgds-span-6">span-6</div>
    </div>`;
  },
};

/**
 * Override the default behaviour and specify the number of columns with classes `qgds-cols-{x}`.
 * Specify number of columns at each breakpoint with responsive modifiers `qgds-cols-{x}:{breakpoint}`.
 * Specify the span of each child item with responsive modifiers `qgds-span-{x}:{breakpoint}`.
 */
export const CustomGrid: Story = {
  render: () => {
    return html`<div class="qgds-cols qgds-cols-2 qgds-cols-2:sm qgds-cols-3:md qgds-cols-6:lg qgds-cols-8:xl">
      <div class="qgds-span-1">span-1</div>
      <div class="qgds-span-5 ">span-5</div>
      <div class="qgds-span-2">span-2</div>
      <div class="qgds-span-4">span-4</div>
      <div class="qgds-span-1  qgds-span-2:lg">span-1 span-2:lg</div>
      <div class="qgds-span-1  qgds-span-2:lg">span-1 span-2:lg</div>
      <div class="qgds-span-1  qgds-span-2:lg">span-1 span-2:lg</div>
    </div>`;
  },
};

/**
 * Do away with breakpoints and column counting with a smart grid based on a minimum column width.
 * Apply class `qgds-cols-auto-fill` to create empty grid columns to complete a row (generally recommended).
 * Alternatively apply class `qgds-cols-auto-fit` to ensure items stretch to fill an entire row.
 * Responsive span classes for child items also work.
 * - Control minimum column width with CSS custom property `qgds-col-min` Default is 5rem.
 */
export const AutoGrid: Story = {
  name: "Auto-fill / auto-fit",
  args: {
    itemCount: 1,
    itemSpan: 1,
    columnCount: "auto-fill",
  },
  tags: ["!dev"],
  render: (args) => {
    const columnMinInlineStyle =
      args.columnMin && (args.columnCount === "auto-fill" || args.columnCount === "auto-fit")
        ? `--qgds-col-min: ${args.columnMin}rem;`
        : undefined;
    return html`<div
      class="qgds-cols ${classMap({ [`qgds-cols-${args.columnCount}`]: args.columnCount !== undefined })}"
      style=${ifDefined(columnMinInlineStyle)}
    >
      <div class="qgds-span-1">span-1</div>
      <div class="qgds-span-2">span-2</div>
      <div class="qgds-span-3">span-3</div>
      ${map(range(args.itemCount), (i) => {
        // prettier-ignore
        return html`<div class=${ifDefined(args.itemSpan > 1 ? `qgds-span-${args.itemSpan}` : undefined )} >Item ${i + 1}</div>\n      `;
      })}
    </div>`;
  },
};
