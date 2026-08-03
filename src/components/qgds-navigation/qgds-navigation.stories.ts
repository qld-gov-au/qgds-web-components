import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./qgds-navigation";
import "../qgds-link-item/qgds-link-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSNavigation } from "./qgds-navigation";
import { withEventActions } from "../../../.storybook/storybook-helpers";
import {
  Default,
  Active,
  ActiveWithIcon,
  IconOnly,
  LongLabel,
  WithIcon,
  With5ChildrenAndDescription,
  With1Child,
  With2Children,
  With3Children,
  With4Children,
} from "./qgds-navigation-item.stories";
import { QGDSNavigationItem } from "./qgds-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");
const { args: itemArgs, template: itemTemplate } = getStorybookHelpers<QGDSNavigationItem>("qgds-navigation-item");

type Args = typeof args;

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ";

// interface ItemData {
//   args: Args;
//   items?: ItemData[];
// }

// const items: ItemData[] = [
//   { args: { ...defaultItem, description: loremIpsum.substring(0, 100) } },
//   { args: { ...activeItem, description: loremIpsum.substring(0, 150) } },
//   { args: { ...defaultWithIconItem, description: loremIpsum.substring(0, 200) } },
//   { args: { ...activeWithIcon, description: loremIpsum.substring(0, 250) } },
// ];

// const itemsLevel1: ItemData[] = [
//   { args: homeItem },
//   {
//     args: {
//       ...defaultItem,
//       description: loremIpsum.substring(0, 100),
//       "view-all-url": "#",
//     },
//     items: [...items, { args: longLabelItem }, { args: longLabelItemWithIcon }, ...items],
//   },
//   {
//     args: {
//       ...activeItem,
//       description: loremIpsum.substring(0, 150),
//       "view-all-url": "#",
//       "view-all-label": "A custom view all label",
//     },
//     items,
//   },
//   { args: { ...defaultWithIconItem, description: loremIpsum.substring(0, 200) }, items },

//   { args: { ...activeWithIcon, description: loremIpsum.substring(0, 250) }, items },
// ];

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
      html`${itemTemplate({ ...itemArgs, ...IconOnly.args })} ${itemTemplate({ ...itemArgs, ...Default.args })}
      ${itemTemplate({ ...args, ...Active.args })} ${itemTemplate({ ...itemArgs, ...ActiveWithIcon.args })}
      ${itemTemplate({ ...itemArgs, ...With1Child.args }, html`${itemTemplate({ ...itemArgs, ...Default.args })}`)}
      ${itemTemplate(
        { ...itemArgs, ...With2Children.args },
        html`${itemTemplate({ ...itemArgs, ...Default.args })} ${itemTemplate({ ...itemArgs, ...LongLabel.args })}`
      )}
      ${itemTemplate(
        { ...itemArgs, ...With3Children.args },
        html`${itemTemplate({ ...itemArgs, ...Default.args })} ${itemTemplate({ ...itemArgs, ...Active.args })}
        ${itemTemplate({ ...itemArgs, ...WithIcon.args })}`
      )}
      ${itemTemplate(
        { ...itemArgs, ...With4Children.args },
        html`${itemTemplate({ ...itemArgs, ...Default.args })} ${itemTemplate({ ...itemArgs, ...Active.args })}
        ${itemTemplate({ ...itemArgs, ...LongLabel.args })} ${itemTemplate({ ...itemArgs, ...WithIcon.args })}`
      )}
      ${itemTemplate(
        { ...itemArgs, ...With5ChildrenAndDescription.args, "is-open": true },
        html`${itemTemplate({ ...itemArgs, ...Default.args, description: loremIpsum.substring(0, 50) })}
        ${itemTemplate({ ...itemArgs, ...Active.args, description: loremIpsum.substring(0, 100) })}
        ${itemTemplate({ ...itemArgs, ...LongLabel.args, description: loremIpsum.substring(0, 150) })}
        ${itemTemplate({ ...itemArgs, ...WithIcon.args, description: loremIpsum.substring(0, 200) })}
        ${itemTemplate({ ...itemArgs, ...ActiveWithIcon.args, description: loremIpsum })}`
      )}`
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
