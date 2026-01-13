import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "./qgds-button.ts";

export interface QGDSButtonProps {
  /** Button contents */
  label: string;
  /** Message to log on click */
  message?: string;
  /** Anchor target */
  target?: string;
  /** ARIA label */
  ariaLabel?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Icon slot content */
  myIcon?: string;
  /** Button text content */
  // buttonText?: string;
  trailingIcon?: boolean;

  StoryPalette?: string;
  variant?: string;
}

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled = false,
  target = "",
  ariaLabel = "",
  myIcon = `<div slot="icon" class="icon-test"></div>`,
  trailingIcon = false,
  variant = "primary",
}: QGDSButtonProps) => {
  return html`
    <qgds-button
      ?disabled="${disabled}"
      target="${target}"
      aria-label="${ariaLabel}"
      button-text="${label}"
      ?trailing-icon="${trailingIcon}"
      variant="${variant}"
    >
      ${myIcon ? unsafeHTML(myIcon) : ""}
    </qgds-button>
  `;
};

const meta: Meta<QGDSButtonProps> = {
  title: "Components/QGDS Button",
  tags: ["autodocs"],
  render: (args) => renderButton(args),
  argTypes: {
    StoryPalette: {
      control: "select",
      options: ["default-none", "bright", "tint", "alt", "bold"],
      name: "story palette",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      name: "button variant type",
    },
    label: { control: "text" },
    disabled: { control: "boolean" },
    target: {
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
    },
    ariaLabel: { control: "text" },
    trailingIcon: { control: "boolean", name: "has trailing icon" },
  },
  globals: {
    backgrounds: { value: "default" },
  },
};

export default meta;
type Story = StoryObj<QGDSButtonProps>;

export const Button: Story = {
  args: {
    label: "QGDS Button",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const Default: Story = {
  args: {
    label: "Default",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const NoIcon: Story = {
  args: {
    label: "No icon",
    myIcon: "",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const Disabled: Story = {
  args: {
    label: "Disabled Button",
    disabled: true,
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};

export const CustomMessage: Story = {
  args: {
    label: "Custom Message",
    message: "Custom click message!",
  },
  decorators: [
    (Story, context) => html`
      <div class="parent-container ${context.args.StoryPalette ?? ""}">
        ${Story()}
      </div>
    `,
  ],
};
