import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import type { QGDSCallToAction } from "./qgds-call-to-action.js";
import "./qgds-call-to-action.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSCallToAction>("qgds-call-to-action");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Call To Action",
  component: "qgds-call-to-action",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "View all",
    href: "#",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

/** Default call to action with an arrow-right icon. */
export const Default: Story = {
  args: {
    label: "View all",
    href: "#",
  },
};

/** View all variant — uses the larger view-all icon. */
export const ViewAll: Story = {
  name: "View All",
  args: {
    label: "View all services",
    href: "#",
    "is-view-all": true,
  },
};
