import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";

import type { QGDSIcon } from "./qgds-icon";
import "./qgds-icon";
import { ICON_NAMES } from "./icon-names.js";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSIcon>("qgds-icon");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSIconStoryArgs = typeof args;

const meta: Meta<QGDSIconStoryArgs> = {
  title: "Components/Icon",
  component: "qgds-icon",
  tags: ["autodocs"],
  args: {
    ...args,
    "icon-id": "home",
  },
  argTypes,
  render: (storyArgs) => template(storyArgs),
};

export default meta;
type Story = StoryObj<QGDSIconStoryArgs>;

export const Default: Story = {
  args: {
    "icon-id": "home",
    "aria-label": "Home icon",
  },
};

/** Multiple icons at medium size */
export const AllIcons: Story = {
  args: {
    size: "md",
  },
  render: (storyArgs) => html`
    <style>
      .my-icons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
        gap: 1rem;
      }
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .icon-item qgds-icon {
        display: flex;
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--qgds-color-border);
        border-radius: 0.25rem;
      }
      .icon-item qgds-icon:hover {
        --qgds--icon-color-hover: hsl(from var(--qgds-color-border) h s 75%);
        box-shadow: 0 0 0 2px var(--qgds--icon-color-hover);
      }
      .icon-name {
        font-size: 0.75rem;
        text-align: center;
        word-break: break-word;
      }
    </style>
    <section class="my-icons">
      ${ICON_NAMES.map(
        (iconName) => html`
          <div class="icon-item">
            <qgds-icon
              icon-id="${iconName}"
              size="${storyArgs.size}"
              aria-label="${iconName}"
              title="${iconName}"
            ></qgds-icon>
            <span class="icon-name">${iconName}</span>
          </div>
        `
      )}
    </section>
  `,
};
