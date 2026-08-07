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

// const navItems = html`
//   <qgds-link-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-link-item>

//   <qgds-link-item label="Services" href="#services" view-all-url="#services" view-all-label="View all services">
//     <qgds-link-item label="Visiting someone in hospital" href="#visiting"></qgds-link-item>
//     <qgds-link-item label="Going to hospital" href="#going"></qgds-link-item>
//     <qgds-link-item label="Leaving hospital" href="#leaving"></qgds-link-item>
//     <qgds-link-item label="Aboriginal and Torres Strait Islander support" href="#atsi"></qgds-link-item>
//     <qgds-link-item label="Interpreter services" href="#interpreter"></qgds-link-item>
//     <qgds-link-item label="Your health record" href="#records"></qgds-link-item>
//   </qgds-link-item>

//   <qgds-link-item label="Quit smoking" href="#quit" view-all-url="#quit" view-all-label="View all">
//     <qgds-link-item
//       label="Know your habits"
//       href="#habits"
//       description="Learn what makes you feel like smoking, how you can avoid triggers, and change your habits."
//     ></qgds-link-item>
//     <qgds-link-item
//       label="What to expect"
//       href="#expect"
//       description="Learn how to manage withdrawal symptoms, stress and possible weight gain."
//     ></qgds-link-item>
//     <qgds-link-item
//       label="Use quit tools and apps"
//       href="#tools"
//       description="Keep on track by using digital tools and apps for support, motivation and useful advice while quitting."
//     ></qgds-link-item>
//     <qgds-link-item
//       label="Get help from Quitline"
//       href="#quitline"
//       description="Quitline is a telephone service dedicated to helping Queenslanders quit smoking."
//     ></qgds-link-item>
//   </qgds-link-item>

//   <qgds-link-item label="About" href="#about"></qgds-link-item>
// `;

const meta: Meta<Args> = {
  title: "Components/Navigation",
  component: "qgds-navigation",
  tags: ["autodocs"],
  args: {
    ...args,
    href: "#",
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
      `
    )}`;
  },
};

/** Dark horizontal navigation. */
export const Dark: Story = {
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
