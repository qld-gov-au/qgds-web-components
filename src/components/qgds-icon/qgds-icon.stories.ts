import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "./qgds-icon.ts";

export interface QGDSIconProps {
  /** Icon identifier */
  iconId: string;
  /** Icon size */
  size: "sm" | "md" | "lg" | "xl";
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Whether to hide from screen readers */
  ariaHidden: boolean;
}

/** QGDS Icon Web Component */
const renderIcon = ({
  iconId = "home",
  size = "md",
  ariaLabel,
  ariaHidden = false,
}: QGDSIconProps) => {
  return html`
    <qgds-icon
      iconId="${iconId}"
      size="${size}"
      ariaLabel="${ariaLabel}"
      ?ariaHidden="${ariaHidden}"
    >
    </qgds-icon>
  `;
};

const meta: Meta<QGDSIconProps> = {
  title: "Components/QGDS Icon",
  tags: ["autodocs"],
  render: (args) => renderIcon(args),
  argTypes: {
    iconId: { control: "text" },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    ariaLabel: { control: "text" },
    ariaHidden: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<QGDSIconProps>;

export const Default: Story = {
  args: {
    iconId: "home",
    size: "md",
    ariaHidden: false,
  },
};

export const Small: Story = {
  args: {
    iconId: "home",
    size: "sm",
    ariaLabel: "Home",
    ariaHidden: false,
  },
};

export const Large: Story = {
  args: {
    iconId: "home",
    size: "lg",
    ariaLabel: "Home",
    ariaHidden: false,
  },
};

export const ExtraLarge: Story = {
  args: {
    iconId: "home",
    size: "xl",
    ariaLabel: "Home",
    ariaHidden: false,
  },
};

export const Decorative: Story = {
  args: {
    iconId: "home",
    size: "md",
    ariaHidden: true,
  },
};
