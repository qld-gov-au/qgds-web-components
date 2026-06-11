import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
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
        qgds-tile-button + qgds-tile-button {
            border-left: 1px solid #418fed;
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

export const ExampleOnAdvancedBannerLinks: Story = {
  render: () => {
    return html`
    <section style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center; gap: 1rem; max-width: max-content;">
        <qgds-tile-button label="Contact us" icon-name="search" href="/contact-us"></qgds-tile-button>
        <qgds-tile-button label="Visiting hours" icon-name="clock" href="/visiting-hours"></qgds-tile-button>
        <qgds-tile-button label="Our services" icon-name="favourite" href="/our-services"></qgds-tile-button>
        <qgds-tile-button label="Planning a visit" icon-name="car" href="/planning-a-visit"></qgds-tile-button>
    </section>`;
   },
};
