import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import "./qgds-button.ts";

export interface QGDSButtonProps {
  /** Button contents */
  label: string;
  /** Message to log on click */
  message?: string;
  /** Hyperlink reference */
  href?: string;
  /** Anchor target */
  target?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled = false,
  href = "",
  target = "",
  ariaLabel = "",
}: QGDSButtonProps) => {
  return html`
    <qgds-button
      ?disabled="${disabled}"
      href="${href}"
      target="${target}"
      aria-label="${ariaLabel}"
    >
      ${label}
    </qgds-button>
  `;
};

const meta: Meta<QGDSButtonProps> = {
  title: "Components/QGDS Button",
  tags: ["autodocs"],
  render: (args) => renderButton(args),
  argTypes: {
    label: { control: "text" },
    disabled: { control: "boolean" },
    href: { control: "text" },
    target: { control: "text" },
    ariaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<QGDSButtonProps>;

export const Button: Story = {
  args: {
    label: "Button",
  },
};

export const Default: Story = {
  args: {
    label: "Default",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    disabled: true,
  },
};

export const CustomMessage: Story = {
  args: {
    label: "Custom Message",
    message: "Custom click message!",
  },
};
