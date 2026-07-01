import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

const oneToTwelve = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const columnCountOptions = ["auto-fill", "auto-fit", ...oneToTwelve] as const;

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
  args: {
    itemCount: 12,
    itemSpan: 1,
    columnCount: undefined,
    columnMin: 5,
    // gutterWidth: 32,
  },
  argTypes: {
    columnCount: {
      control: {
        type: "select",
      },
      options: columnCountOptions,
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
            color: white;
            background-color: #005eb8;
            border-radius: 16px;
            padding: 8px;
            text-align: center;
          }
        </style>
        ${story()}`,
  ],
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

/**
 * Apply class qgds-cols-auto-fill to create empty grid columns to complete a row.
 */
export const AutoFill: Story = {
  args: {
    itemCount: 1,
    itemSpan: 1,
    columnCount: "auto-fill",
  },
};

/**
 * Apply class qgds-cols-auto-fit to automatically create grid columns based on number of items.
 *
 */
export const AutoFit: Story = {
  args: {
    itemCount: 1,
    itemSpan: 1,
    columnCount: "auto-fit",
  },
};
