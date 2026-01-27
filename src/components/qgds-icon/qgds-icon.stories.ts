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
    StoryPalette: {
      control: "select",
      options: [
        "palette-default",
        "palette-pale",
        "palette-muted",
        "palette-bold",
        "palette-deep",
      ],
      name: "story palette",
    },
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
    StoryPalette: "palette-default",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
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
        grid-template-columns: repeat(auto-fit, 2.5rem);

        gap: 1rem;
      }
      .my-icons qgds-icon {
        display: flex;
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--qgds-color-border);
        border-radius: 0.25rem;
      }
      .my-icons qgds-icon:hover {
        box-shadow: 0 0 0 2px rgb(0 0 0 / 0.15);
      }
    </style>
    <section class="my-icons">
      ${ICON_NAMES.map(
        (iconName) => html`
          <qgds-icon
            iconId="${iconName}"
            size="${args.size}"
            ariaLabel="${iconName}"
            title="${iconName}"
          ></qgds-icon>
        `,
      )}
    </section>
  `,
};
