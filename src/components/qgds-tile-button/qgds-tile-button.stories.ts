import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { withEventActions } from "../../../.storybook/storybook-helpers";
import { html } from "lit";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
import type { QGDSTileButton } from "./qgds-tile-button.js";
import "./qgds-tile-button.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSTileButton>("qgds-tile-button");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Tile Button",
  component: "qgds-tile-button",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "Tile Button",
    "icon-name": "design",
  },
  argTypes: {
    ...argTypes,
    href: { control: "text" },
    "icon-name": {
      control: "select",
      options: ["", ...ICON_NAMES],
      labels: { "": "None" },
      table: {
        category: "Icon",
      },
    },
  },
  render: (args) => template(args),
  decorators: [withEventActions("qgds-click")],
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    label: "Menu",
    "icon-name": "menu",
  },
};

export const Link: Story = {
  args: {
    label: "Contact us",
    "icon-name": "phone",
    href: "https://www.qld.gov.au/contact-us",
  },
};

export const ExampleOnHeaderButtons: Story = {
  render: () => {
    return html`
    <style>
      qgds-tile-button {
        border-left: 2px solid #418fed;
      }
      #root-inner>div {
        padding: 0px !important;
      }
    </style>
    <section style="display: flex; justify-content: flex-end; border-bottom: 0.25rem solid #84d3ff">
      <qgds-tile-button label="Search" icon-name="search"></qgds-tile-button>
      <qgds-tile-button label="Menu" icon-name="menu"></qgds-tile-button>
      <qgds-tile-button label="Close" icon-name="close"></qgds-tile-button>
    </section>`;
   },
};
