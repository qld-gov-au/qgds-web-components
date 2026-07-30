import type { Meta, StoryObj } from "@storybook/web-components";
import { html, TemplateResult } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import { withEventActions } from "../../../.storybook/storybook-helpers";
import type { QGDSHeader } from "./qgds-header";
import type { QGDSNavigation } from "../qgds-navigation/qgds-navigation";
import "./qgds-header";
import "../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-link/qgds-link";
import "../qgds-logo/qgds-logo";
import "../qgds-search-input/qgds-search-input";
import "../qgds-navigation/qgds-navigation";

const { args, argTypes, template } = getStorybookHelpers<QGDSHeader>("qgds-header");
const { args: navArgs, template: navTemplate } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Header",
  component: "qgds-header",
  tags: ["autodocs"],
  args: {
    ...args,
    "site-name": "Site name",
  },
  argTypes,
  render: (args) => template(args),
};

export default meta;

// The mobile buttons only fire payload-less events; the slotted components own what
// happens next. Search has no mobile design yet, so it just logs to the Actions
// panel. Menu toggles the demo nav's `open` attribute, standing in for a real
// mega-menu component that would manage its own open state.
const logSearchToggle = action("qgds-toggle-search-mobile");
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const onSearchToggle = () => logSearchToggle();

const headerTemplate = (args: Args, children: TemplateResult) => html`
  <qgds-header site-name=${args["site-name"]} @qgds-toggle-search-mobile=${onSearchToggle}> ${children} </qgds-header>
`;

export const Default: Story = {
  args: meta.args,
  parameters: {
    ...chromaticModes,
  },
  render: (args) =>
    headerTemplate(
      args,
      html`<qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>
        <qgds-attribution-bar slot="pre-header" palette="bold" url="https://www.qld.gov.au" label="qld.gov.au">
          <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
        </qgds-attribution-bar>
        <qgds-search-input slot="search"></qgds-search-input> ${navTemplate({
          ...navArgs,
          slot: "navigation",
          id: "mynav",
        })}`
    ),
  decorators: [
    withEventActions([
      "qgds-navigation-open",
      "qgds-navigation-opened",
      "qgds-navigation-close",
      "qgds-navigation-closed",
    ]),
  ],
};
