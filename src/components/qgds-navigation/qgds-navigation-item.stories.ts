import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "./qgds-navigation-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { type QGDSNavigationItem, tagName } from "./qgds-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigationItem>(tagName);
type Args = typeof args;

// Some simple helper
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
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: (args) => template(args),
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  args: {
    label: "Default",
    href: "#",
  },
};

export const IconOnly: Story = {
  args: {
    label: "Home",
    href: "#",
    "icon-name": "home",
    "hide-label": true,
  },
};

export const WithIcon: Story = {
  args: {
    label: "With icon",
    href: "#",
    "icon-name": "wheelchair",
  },
};

export const Active: Story = {
  args: {
    label: "Active",
    href: "#",
    "is-active": true,
  },
};

export const ActiveWithIcon: Story = {
  args: {
    label: "Active with icon",
    href: "#",
    "icon-name": "wheelchair",
    "is-active": true,
  },
};

export const LongLabel: Story = {
  args: {
    label: loremIpsum,
    href: "#",
  },
};

export const LongLabelWithIcon: Story = {
  args: {
    label: loremIpsum,
    href: "#",
    "icon-name": "announcement",
  },
};

export const With1Child: Story = {
  args: {
    label: "I have 1 child",
    href: "#",
  },
  render: (args) => {
    return html`${template(args, html`${template({ ...args, ...Default.args })}`)}`;
  },
};

export const With2Children: Story = {
  args: {
    label: "I have 2 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...LongLabel.args })}`
    )}`;
  },
};

export const With3Children: Story = {
  args: {
    label: "I have 3 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...WithIcon.args })}`
    )}`;
  },
};

export const With4Children: Story = {
  args: {
    label: "I have 4 children",
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...LongLabel.args })} ${template({ ...args, ...WithIcon.args })}`
    )}`;
  },
};

export const With5ChildrenAndDescription: Story = {
  args: {
    label: "Full mega menu",
    "view-all-url": "#",
    description: loremIpsum,
    href: "#",
  },
  render: (args) => {
    return html`${template(
      args,
      html`${template({ ...args, ...Default.args })} ${template({ ...args, ...Active.args })}
      ${template({ ...args, ...LongLabel.args })} ${template({ ...args, ...ActiveWithIcon.args })}
      ${template({ ...args, ...IconOnly.args })}`
    )}`;
  },
};

// export const HorizontalWithChildren: Story = {
//   args: HorizontalMulti.args,
//   argTypes: HorizontalMulti.argTypes,
//   render: (args) => html`
//     ${template(
//       { ...args, ...defaultItem },
//       html`${template({ ...args, label: "Level 2 Item 1" })}
//       ${template({
//         ...args,
//         label: `Level 2 Item 2 has quite a long title, whatever should happen to all this text?`,
//       })}`
//     )}
//     ${template(
//       { ...args, ...defaultWithIconItem },
//       html`${template({ ...args, label: "Level 2 Item 1" })}
//       ${template({
//         ...args,
//         label: `Level 2 Item 2 ${loremIpsum}`,
//       })}
//       ${template({ ...args, label: "Level 2 Item 3" })}`
//     )}
//     ${template(
//       { ...args, label: "Active", "is-active": true },
//       html`${template({ ...args, label: "Level 2 Item 1" })}
//       ${template({ ...args, label: "Level 2 Active Item 2", "is-active": true })}
//       ${template({
//         ...args,
//         label: `Level 2 Item 3 ${loremIpsum}`,
//       })}`
//     )}
//     ${template(
//       { ...args, label: "Active with icon", "is-active": true, "icon-name": "announcement" },
//       html`${template({ ...args, label: "Level 2 Item 1" })}
//       ${template({ ...args, label: "Level 2 Active Item 2", "is-active": true })}
//       ${template({
//         ...args,
//         label: `Level 2 Item 3 ${loremIpsum}`,
//       })}`
//     )}
//   `,
//   decorators: HorizontalMulti.decorators,
// };

// export const HorizontalWithChildrenAndDescription: Story = {
//   args: { ...HorizontalWithChildren.args, description: loremIpsum, "view-all-url": "#" },
//   argTypes: HorizontalWithChildren.argTypes,
//   render: HorizontalWithChildren.render,
//   decorators: HorizontalMulti.decorators,
// };

// export const VerticalNavItem: Story = {
//   args: { ...HorizontalMulti.args, variant: "vertical" },
//   argTypes: HorizontalMulti.argTypes,
//   render: HorizontalMulti.render,
//   decorators: [(story) => html`<div style="max-width: 640px">${story()}</div>`],
// };

// export const VerticalWithChildren: Story = {
//   args: { ...HorizontalWithChildren.args, variant: "vertical" },
//   argTypes: VerticalNavItem.argTypes,
//   render: HorizontalWithChildren.render,
//   decorators: VerticalNavItem.decorators,
// };

// attach a standard click event, should not prevent default
