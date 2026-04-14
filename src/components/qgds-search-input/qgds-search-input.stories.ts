import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSSearchInput, tagName } from "./qgds-search-input";
import "./qgds-search-input";

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
    <div @qgds-search=${action("qgds-search")}>${template(args)}</div>
  `,
};

export default meta;

export const Default: Story = {
  args: {
    ...args,
    placeholder: "Search",
  },
};

export const IconOnly: Story = {
  args: {
    ...args,
    "icon-only": true,
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

export const WithValue: Story = {
  args: {
    ...Default.args,
    value: "Queensland",
  },
};

export const AllVariants: Story = {
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
      <qgds-search-input placeholder="${args.placeholder}" variant="outlined">
      </qgds-search-input>

      <qgds-search-input placeholder="${args.placeholder}" variant="filled">
      </qgds-search-input>
    `;
  },
  args: {
    ...Default.args,
  },
};

export const AllVariantsSoft: Story = {
  ...AllVariants,
  globals: { globalPalette: "soft" },
};

export const AllVariantsMuted: Story = {
  ...AllVariants,
  globals: { globalPalette: "muted" },
};

export const AllVariantsBold: Story = {
  ...AllVariants,
  globals: { globalPalette: "bold" },
};

export const AllVariantsDeep: Story = {
  ...AllVariants,
  globals: { globalPalette: "deep" },
};
