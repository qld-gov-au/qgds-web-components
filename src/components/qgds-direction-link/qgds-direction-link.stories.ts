import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSDirectionLink } from "./qgds-direction-link.js";
import "./qgds-direction-link.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSDirectionLink>("qgds-direction-link");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Direction Link",
  component: "qgds-direction-link",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Direction",
    href: "#",
    direction: "right",
    animation: true,
  },
  argTypes: {
    ...argTypes,
    direction: {
      control: { type: "select" },
      options: ["up", "down", "left", "right"],
    },
    animation: {
      control: "boolean",
    },
  },
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    direction: "right",
  },
};

export const BackToTop: Story = {
  args: {
    label: "Back to top",
    href: "#top",
    direction: "up",
    animation: false,
  },
  decorators: [
    (story) => {
      const isStandaloneIframe = window === window.top;
      if (isStandaloneIframe) {
        return story();
      }

      return html`
        <p>
          The "Back to top" component will scroll to the target element using native CSS scroll-behavior
        </p>
        <p style="margin-bottom: 100vh;">
          <a href="#top">Click me and see it in action.</a>
        </p>
        ${story()}
      `;
    },
  ],
  render: (args) => html`
    <h2 id="top" style="padding-block: 2rem;">Top of the page</h2>
    <div style="margin-bottom: 100rem;">Scroll down to see the "Back to top" link.</div>
    <div style="display: flex; justify-content: flex-end;">
      <qgds-direction-link
          label=${args.label}
          href=${args.href}
          direction=${args.direction}
          ?animation=${args.animation}
        ></qgds-direction-link>
    </div>
  `,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
