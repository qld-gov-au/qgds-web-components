import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import { withEventActions } from "../../../.storybook/storybook-helpers";
import type { QGDSHeader } from "./qgds-header";
import "./qgds-header";
import "../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-link/qgds-link";
import "../qgds-logo/qgds-logo";
import "../qgds-search-input/qgds-search-input";
import "../qgds-navigation/qgds-navigation";

const { args: defaultArgs, argTypes, template } = getStorybookHelpers<QGDSHeader>("qgds-header");

type Args = typeof defaultArgs;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Header",
  component: "qgds-header",
  tags: ["autodocs"],
  args: defaultArgs,
  argTypes,
  parameters: {
    controls: {
      exclude: ["search-open"],
    },
  },
  render: (args) => template(args),
};

export default meta;

const omitDefault = <T>(value: T, defaultValue: T): T | undefined => (value === defaultValue ? undefined : value);

const logSearchToggle = action("qgds-toggle-search-mobile");

const onSearchToggle = (): void => {
  logSearchToggle();
};

const headerTemplate = (args: Args) => html`
  <qgds-header
    palette=${ifDefined(omitDefault(args.palette, defaultArgs.palette))}
    site-name=${ifDefined(omitDefault(args["site-name"], defaultArgs["site-name"]))}
    site-url=${ifDefined(omitDefault(args["site-url"], defaultArgs["site-url"]))}
    mobile-top-content=${ifDefined(omitDefault(args["mobile-top-content"], defaultArgs["mobile-top-content"]))}
    ?hide-coa-logo=${args["hide-coa-logo"]}
    ?hide-mobile-bottom-row=${args["hide-mobile-bottom-row"]}
    @qgds-toggle-search-mobile=${onSearchToggle}
  >
    <qgds-attribution-bar slot="pre-header" palette="bold" url="https://www.qld.gov.au" label="qld.gov.au">
      <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
    </qgds-attribution-bar>

    <qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>

    <qgds-search-input slot="search"></qgds-search-input>

    <qgds-navigation slot="navigation" id="mynav">
      <qgds-link-item label="Home" href="/" only-icon icon-name="home" is-current></qgds-link-item>
      <qgds-link-item label="About" href="/about"></qgds-link-item>
      <qgds-link-item label="Services" href="/services"></qgds-link-item>
      <qgds-link-item label="Contact" href="/contact"></qgds-link-item>
    </qgds-navigation>
  </qgds-header>
`;

export const Default: Story = {
  args: {
    ...meta.args,
    "site-name": "Site Name",
  },
  parameters: {
    ...chromaticModes,
  },
  render: (args) => headerTemplate(args),
  decorators: [
    withEventActions([
      "qgds-navigation-open",
      "qgds-navigation-opened",
      "qgds-navigation-close",
      "qgds-navigation-closed",
    ]),
  ],
};
