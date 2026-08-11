import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./qgds-navigation";
import "../qgds-link-item/qgds-link-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSNavigation } from "./qgds-navigation";
import { withEventActions } from "../../../.storybook/storybook-helpers";
import { QGDSNavigationItem } from "./qgds-navigation-item";
import "./qgds-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");
const { args: _itemArgs, template: _itemTemplate } = getStorybookHelpers<QGDSNavigationItem>("qgds-navigation-item");

type Args = typeof args;

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ";

const meta: Meta<Args> = {
  title: "Components/Navigation",
  component: "qgds-navigation",
  tags: ["autodocs"],
  args: {
    ...args,
  },
  argTypes,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    withEventActions([
      "qgds-navigation-open",
      "qgds-navigation-opened",
      "qgds-navigation-close",
      "qgds-navigation-closed",
    ]),
    (story) => {
      return html`${story()}
        <button
          class="qgds-mt-24"
          @click=${() => document.dispatchEvent(new CustomEvent("qgds-navigation-open", { bubbles: true }))}
        >
          Open mobile menu
        </button>`;
    },
  ],
};

export default meta;
type Story = StoryObj<Args>;

/** Default light horizontal navigation — link click opens the mega-menu dropdown. */
export const Horizontal: Story = {
  args: {
    variant: "horizontal",
  },
  render: (args) => {
    return html`${template(
      args,
      html`
        <qgds-navigation-item label="Home" href="#" icon-name="home" hide-label></qgds-navigation-item>
        <qgds-navigation-item label="Default" href="#"></qgds-navigation-item>
        <qgds-navigation-item label="Active" href="#" is-active></qgds-navigation-item>
        <qgds-navigation-item label="Active with icon" href="#" icon-name="wheelchair" is-active></qgds-navigation-item>

        <qgds-navigation-item
          label="Full mega menu"
          href="#"
          view-all-url="#"
          description="${loremIpsum}"
          icon-name="announcement"
          is-open
        >
          <qgds-navigation-item
            label="Default"
            href="#"
            description="${loremIpsum.substring(0, 50)}"
          ></qgds-navigation-item>
          <qgds-navigation-item
            label="Active"
            href="#"
            is-active
            description="${loremIpsum.substring(0, 100)}"
          ></qgds-navigation-item>
          <qgds-navigation-item
            label="${loremIpsum}"
            href="#"
            description="${loremIpsum.substring(0, 150)}"
          ></qgds-navigation-item>
          <qgds-navigation-item
            label="With icon"
            href="#"
            icon-name="wheelchair"
            description="${loremIpsum.substring(0, 200)}"
          ></qgds-navigation-item>
          <qgds-navigation-item
            label="Active with icon"
            href="#"
            icon-name="wheelchair"
            is-active
            description="${loremIpsum}"
          ></qgds-navigation-item>
        </qgds-navigation-item>

        <qgds-navigation-item label="I have 1 child" href="#">
          <qgds-navigation-item label="Default" href="#"></qgds-navigation-item>
        </qgds-navigation-item>

        <qgds-navigation-item label="I have 2 children" href="#">
          <qgds-navigation-item label="Default" href="#"></qgds-navigation-item>
          <qgds-navigation-item label="${loremIpsum}"></qgds-navigation-item>
        </qgds-navigation-item>

        <qgds-navigation-item label="I have 3 children" href="#">
          <qgds-navigation-item label="Default" href="#"></qgds-navigation-item>
          <qgds-navigation-item label="Active" href="#" is-active></qgds-navigation-item>
          <qgds-navigation-item label="With icon" href="#" icon-name="wheelchair"></qgds-navigation-item>
        </qgds-navigation-item>

        <qgds-navigation-item label="I have 4 children" href="#">
          <qgds-navigation-item label="Default" href="#"></qgds-navigation-item>
          <qgds-navigation-item label="Active" href="#" is-active></qgds-navigation-item>
          <qgds-navigation-item label="${loremIpsum}"></qgds-navigation-item>
          <qgds-navigation-item label="With icon" href="#" icon-name="wheelchair"></qgds-navigation-item>
        </qgds-navigation-item>

        <qgds-navigation-item label="Login" href="#" slot="mobile-cta" icon-name="profile"></qgds-navigation-item>
        <qgds-navigation-item label="Contact us" href="#" slot="mobile-cta" icon-name="phone"></qgds-navigation-item>
      `
    )}`;
  },
};

/** Dark horizontal navigation. */
export const Bold: Story = {
  args: { variant: "horizontal", palette: "bold" },
  render: Horizontal.render,
};

/** Vertical layout — a chevron toggle button expands the dropdown inline. */
export const Vertical: Story = {
  args: { variant: "vertical" },
  render: Horizontal.render,
};

/** Dark vertical layout. */
export const DarkVertical: Story = {
  args: { palette: "bold", variant: "vertical" },
  render: Horizontal.render,
};
