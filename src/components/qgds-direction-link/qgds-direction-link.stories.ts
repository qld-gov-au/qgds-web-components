import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSDirectionLink } from "./qgds-direction-link.js";
import "./qgds-direction-link.js";
import { withEventAction } from "../../../.storybook/storybook-helpers";

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
  decorators: [withEventAction("scroll-to-element")],
  render: (args) => template(args),
};

const scrollToElement = (id: string) => (event: Event) => {
  event.preventDefault();

  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  });

  event.currentTarget?.dispatchEvent(
    new CustomEvent("scroll-to-element", {
      detail: {
        href: `#${id}`,
        action: `scroll-to-${id}`,
      },
      bubbles: true,
      composed: true,
    })
  );
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
  render: (args) =>
      html`
        <h2 id="top" style="margin-block: 2rem;">Top of the page</h2>
        <div style="margin-bottom: 100rem;">Scroll down to see the "Back to top" link.</div>
        <qgds-direction-link
          label=${args.label}
          href=${args.href}
          direction=${args.direction}
          ?animation=${args.animation}
          @click=${scrollToElement('top')}
        ></qgds-direction-link>
      `
};
