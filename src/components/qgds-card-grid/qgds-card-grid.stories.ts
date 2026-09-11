import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { QGDSCardGrid } from "./qgds-card-grid";
import "./qgds-card-grid";

import "../qgds-card/qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSCardGrid>("qgds-card-grid");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Card Grid",
  component: "qgds-card-grid",
  tags: ["autodocs"],
  args: {
    ...args,
    "default-slot": `
      <qgds-card heading="Card 1" palette="default">Card content goes here.<div slot="footer-text">Footer content</div></qgds-card>
      <qgds-card heading="Card 2" palette="bold">Card content goes here.<div slot="footer-text">Footer content</div></qgds-card>
      <qgds-card heading="Card 3" palette="deep">Card content goes here. This card has longer content and should push all cards in the group to be the same equal hieght.<div slot="footer-text">Footer content</div></qgds-card>
      <qgds-card heading="Card 4">Card content goes here.<div slot="footer-text">Footer content</div></qgds-card>
    `,
  },
  argTypes: {
    ...argTypes,
    "default-slot": {
      ...argTypes["default-slot"],
      control: { type: "text" },
      description: "Slot content for the card grid. Typically contains multiple `<qgds-card>` elements.",
    },
  },
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {
  args: {
    spacing: "md",
  },
};
