import type { Meta, StoryObj } from "@storybook/web-components-vite";
// import { html } from "lit";
import "./qgds-navigation-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { type QGDSNavigationItem, tagName } from "./qgds-navigation-item";
import { html } from "lit";
// import { withEventActions } from "../../../.storybook/storybook-helpers";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigationItem>(tagName);
type Args = typeof args;

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ";

const meta: Meta<Args> = {
  title: "Components/Navigation/Navigation item",
  component: tagName,
  args: {
    ...args,
    href: "#",
  },
  argTypes,
  decorators: [(story) => html`<div style="position: relative">${story()}</div>`],
};
export default meta;
type Story = StoryObj<Args>;

// TODO: chromatic viewports for lg / xl screen
export const HorizontalNavItem: Story = {
  render: (args) => html`
    ${template({ ...args, label: "Home", "icon-name": "home", "hide-label": true })}
    ${template({ ...args, label: "Default" })}
    ${template({ ...args, label: "Default with icon", "icon-name": "wheelchair" })}
    ${template({ ...args, label: "Active", "is-active": true })}
    ${template({ ...args, label: "Active with icon", "is-active": true, "icon-name": "announcement" })}
  `,
};

export const HorizontalWithChildren: Story = {
  render: (args) => html`
    ${template(
      { ...args, label: "Default" },
      html`${template({ ...args, label: "Level 2 Item 1" })}
      ${template({
        ...args,
        label: `Level 2 Item 2 has quite a long title, whatever should happen to all this text?`,
      })}`
    )}
    ${template(
      { ...args, label: "Default with icon", "icon-name": "wheelchair" },
      html`${template({ ...args, label: "Level 2 Item 1" })}
      ${template({
        ...args,
        label: `Level 2 Item 2 ${loremIpsum}`,
      })}
      ${template({ ...args, label: "Level 2 Item 3" })}`
    )}
    ${template(
      { ...args, label: "Active", "is-active": true },
      html`${template({ ...args, label: "Level 2 Item 1" })}
      ${template({ ...args, label: "Level 2 Active Item 2", "is-active": true })}
      ${template({
        ...args,
        label: `Level 2 Item 3 ${loremIpsum}`,
      })}`
    )}
    ${template(
      { ...args, label: "Active with icon", "is-active": true, "icon-name": "announcement" },
      html`${template({ ...args, label: "Level 2 Item 1" })}
      ${template({ ...args, label: "Level 2 Active Item 2", "is-active": true })}
      ${template({
        ...args,
        label: `Level 2 Item 3 ${loremIpsum}`,
      })}`
    )}
  `,
};

export const HorizontalWithChildrenAndDescription: Story = {
  args: { ...HorizontalWithChildren.args, description: loremIpsum, "view-all-url": "#" },
  render: HorizontalWithChildren.render,
};

export const VerticalNavItem: Story = { args: { variant: "vertical" }, render: HorizontalNavItem.render };

// attach a standard click event, should not prevent default
