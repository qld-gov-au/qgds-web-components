import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { chromaticModes } from "../../../.storybook/modes";

import { type QGDSSideNavigation, tagname } from "./qgds-side-navigation";
import "./qgds-side-navigation";
import { type QGDSSideNavigationItem, tagname as itemTagName } from "./qgds-side-navigation-item";
import "./qgds-side-navigation-item";

const { args, argTypes, template } = getStorybookHelpers<QGDSSideNavigation>(tagname);
const {
  args: itemArgs, // using default args prevents an an undefined slot bug.
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
};

export default meta;

export const DesktopView: StoryObj<Args> = {
  globals: {},
  parameters: {
    ...chromaticModes,
  },
  render: (args) =>
    template(
      { ...args },
      // prettier-ignore
      html`
      ${itemTemplate({ ...itemArgs, slot: "heading", label: "Here is the heading", href: "#" })}
      ${itemTemplate({ ...itemArgs, label: "Level 1 first", href: "#" })}
      ${itemTemplate({ ...itemArgs, label: "Level 1 second, no link" }, 
        html`
        ${itemTemplate({ ...itemArgs, label: "Level 2 first", href: "#" })}
        ${itemTemplate({ ...itemArgs, label: "Level 2 second, no link", },
          html`
          ${itemTemplate({ ...itemArgs, label: "Level 3 first is active", href: "#", "is-active":true })}
          ${itemTemplate({ ...itemArgs, label: "Level 3 second, no link"})}
          ${itemTemplate({ ...itemArgs, label: "Level 3 with an incredibly long title, whatever shall be done with all this text? I mean its just really really REALLY long, indeed. It just goes on and on and on and on, like a never ending story (great movie by the way - just the first one - the sequels leave a lot to be desired). Oh my me.", href: "#" })}`
        )}
        ${itemTemplate({ ...itemArgs, label: "Level 2 with an incredibly long title, whatever shall be done with all this text? I mean its just really really REALLY long, indeed. It just goes on and on and on and on, like a never ending story (great movie by the way - just the first one - the sequels leave a lot to be desired). Oh my me.", href: "#" })}
        ${itemTemplate({ ...itemArgs, label: "Level 2 fourth", href: "#"})}`
      )}
      ${itemTemplate({ ...itemArgs, label: "Level 1 with an incredibly long title, whatever shall be done with all this text? I mean its just really really REALLY long, indeed. It just goes on and on and on and on, like a never ending story (great movie by the way - just the first one - the sequels leave a lot to be desired). Oh my me.", href: "#" })}
      ${itemTemplate({ ...itemArgs, label: "Level 1 fourth", href: "#" })}`
    ),
};
