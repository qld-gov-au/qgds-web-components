import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import "./qgds-icon.ts";
import { ICON_NAMES } from "./icon-names.js";

export interface QGDSIconProps {
  /** Icon identifier */
  iconId: string;
  /** Icon size */
  size: "sm" | "md" | "lg" | "xl";
  /** ARIA label for accessibility */
  ariaLabel: string;
  StoryPalette?: string;
}

/** QGDS Icon Web Component */
const renderIcon = ({
  iconId = "home",
  size = "md",
  ariaLabel = "",
}: QGDSIconProps) => {
  return html`
    <qgds-icon
      iconId="${iconId}"
      size="${size}"
      ariaLabel="${ifDefined(ariaLabel || undefined)}"
    >
    </qgds-icon>
  `;
};

const meta: Meta<QGDSIconProps> = {
  title: "Components/QGDS Icon",
  tags: ["autodocs"],
  render: (args) => renderIcon(args),
  argTypes: {
    iconId: {
      control: "select",
      options: [...ICON_NAMES],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    ariaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<QGDSIconProps>;

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
  render: (args) => html`
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
              size="${args.size}"
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
