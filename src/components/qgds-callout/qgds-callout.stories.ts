import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { QGDSCallout } from "./qgds-callout";
import "./qgds-callout";

const { args, argTypes, template } = getStorybookHelpers<QGDSCallout>("qgds-callout");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Callout",
  component: "qgds-callout",
  tags: ["autodocs"],
  args,
  argTypes: {
    ...argTypes,
    "heading-size": {
      control: "select",
      options: ["none", "xs", "sm", "md"],
      mapping: {
        none: "",
      },
    },
  },

  render: (args) => template(args),
};
export default meta;

export const Default: Story = {
  args: {
    "default-slot": "<p>This is an important callout message.</p>",
  },
};

export const Complex: Story = {
  args: {
    heading: "Before you start",
    "heading-level": "h2",
    "heading-size": "md",
    "default-slot": `
        <p>
          Please read the following information carefully <strong>before proceeding:</strong>
        </p>
        <ul>
          <li>Ensure you have all necessary materials.</li>
          <li>Follow the instructions step by step.</li>
          <li>Contact support if you encounter any issues.</li>
        </ul>
      `,
  },
};
