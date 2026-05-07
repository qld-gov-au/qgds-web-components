import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
// import { html } from "lit";

import { type QGDSSideNavigation, tagname } from "./qgds-side-navigation";
import "./qgds-side-navigation";
import { type QGDSSideNavigationItem, tagname as itemTagName } from "./qgds-side-navigation-item";
import "./qgds-side-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSSideNavigation>(tagname);
const {
  // args: itemArgs,
  // argTypes: itemArgTypes,
  template: itemTemplate,
} = getStorybookHelpers<QGDSSideNavigationItem>(itemTagName);

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Side navigation",
  component: tagname,
  subcomponents: { "Side navigation item": itemTagName },
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args, itemArgs) =>
    template(
      { ...args, mobileHeading: "" },
      // prettier-ignore
      itemTemplate({ ...itemArgs, slot: "heading", label: "Here is the heading", href: "" })
      // itemTemplate({ slot: "heading", label: "Here is the heading", href: "" })
    ),
};

// <qgds-side-navigation-item slot="heading" href=""  label="Here is the heading"></qgds-side-navigation-item>

export default meta;

export const DesktopView: StoryObj<Args> = {
  globals: {},
};
/*

${itemTemplate({ slot: "header", label: "Here is the header", href: "" })}
      ${itemTemplate({ label: "Level 1 first", href: "" })}
      ${itemTemplate({ label: "Level 1 second", href: "" }, 
        html`
        ${itemTemplate({ label: "Level 2 first", href: "" })}
        ${itemTemplate({ label: "Level 2 second", href: "" },
          html`
          ${itemTemplate({ label: "Level 3 first", href: "" })}
          ${itemTemplate({ label: "Level 3 second", href: "" })}
          ${itemTemplate({ label: "Level 3 third", href: "" })}`
        )}
        ${itemTemplate({ label: "Level 2 third", href: "" })}
        ${itemTemplate({ label: "Level 2 fourth", href: ""})}
        ${itemTemplate({ label: "Level 2 fifth", href: "" })}
        ${itemTemplate({ label: "Level 2 sixth", href: "" })}
        ${itemTemplate({ label: "Level 2 seventh", href: "" })}`
      )}
      ${itemTemplate({ label: "Level 1 third", href: "" })}
      ${itemTemplate({ label: "Level 1 fourth", href: "" })}

*/
