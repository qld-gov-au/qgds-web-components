import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSSkipLinks } from "./qgds-skip-links.js";
import "./qgds-skip-links.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSSkipLinks>("qgds-skip-links");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Skip Links",
  component: "qgds-skip-links",
  tags: ["autodocs"],
  args: {
    ...args,
  },
  argTypes: {
    ...argTypes,
    ariaLabel: { control: "text" },
  },
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  decorators: [
    (story) => {
      return html`
        <p>
          To show 'Skip Links' component, click on this text to focus it, then press the Tab key to see the skip links
          appear.
        </p>
        <p>Alternatively, to view Skip Links component in a page, visit the Templates section in Storybook.</p>
        ${story()}
      `;
    },
  ],
};
