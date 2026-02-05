import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import type { QGDSIcon } from "./qgds-icon.ts";
import "./qgds-icon.ts";
import { ICON_NAMES } from "./icon-names.js";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// Exclude "cssProps" category to hide CSS custom properties
const { args, argTypes } = getStorybookHelpers<QGDSIcon>("qgds-icon", {
  // excludeCategories: ["cssProps"],
}) as { args: Partial<QGDSIcon>; argTypes: Record<string, unknown> };

/** QGDS Icon Web Component */
const renderIcon = ({
  iconId = "home",
  size = "md",
  ariaLabel = "",
}: QGDSIcon) => {
  return html`
    <qgds-icon
      iconId="${iconId}"
      size="${size}"
      ariaLabel="${ifDefined(ariaLabel || undefined)}"
    >
    </qgds-icon>
  `;
};

const meta: Meta<QGDSIcon> = {
  title: "Components/QGDS Icon",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (storyArgs) => renderIcon(storyArgs),
};

export default meta;
type Story = StoryObj<QGDSIcon>;

export const Default: Story = {
  args: {
    iconId: "home",
    size: "md",
    ariaLabel: "Home icon",
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
              iconId="${iconName}"
              size="${storyArgs.size}"
              ariaLabel="${iconName}"
              title="${iconName}"
            ></qgds-icon>
            <span class="icon-name">${iconName}</span>
          </div>
        `,
      )}
    </section>
  `,
};
