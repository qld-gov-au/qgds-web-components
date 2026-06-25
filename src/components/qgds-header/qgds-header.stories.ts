import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSHeader } from "./qgds-header";
import "./qgds-header";
import "../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-link/qgds-link";
import "../qgds-logo/qgds-logo";
import "../qgds-search-input/qgds-search-input";

const { args, argTypes, template } = getStorybookHelpers<QGDSHeader>("qgds-header");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Header",
  component: "qgds-header",
  tags: ["autodocs"],
  args: {
    ...args,
    "site-name": "Insert site name",
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
const onNavToggle = (e: Event) => {
  const header = e.currentTarget as HTMLElement;
  header.querySelector('[slot="navigation"]')?.toggleAttribute("open");
};

// Stand-in for a real mega-menu component: a horizontal nav on desktop that, on
// mobile, hides until its own `open` attribute is set (here toggled by onNavToggle).
const demoNavStyles = html`
  <style>
    .demo-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      align-items: center;
    }
    @media (max-width: 991px) {
      .demo-nav {
        display: none;
      }
      .demo-nav[open] {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
        padding: 1rem;
        background-color: var(--qgds-color-background-shade, #f3f3f3);
      }
    }
  </style>
`;

const demoNav = html`
  <nav class="demo-nav" slot="navigation" aria-label="Main navigation">
    <a href="#">Menu text</a>
    <a href="#">Menu text</a>
    <a href="#">Menu text</a>
    <a href="#">Menu text</a>
    <a href="#">Menu text</a>
  </nav>
`;

const headerTemplate = (args: Args) => html`
  ${demoNavStyles}
  <qgds-header
    site-name=${args["site-name"]}
    @qgds-toggle-search-mobile=${onSearchToggle}
    @qgds-toggle-nav-menu=${onNavToggle}
  >
    <qgds-attribution-bar slot="pre-header" palette="bold">
      <qgds-link slot="site-name" target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
      <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
    </qgds-attribution-bar>

    <qgds-search-input slot="search" placeholder="Search this site"></qgds-search-input>

    ${demoNav}
  </qgds-header>
`;

export const Default: Story = {
  args: meta.args,
  parameters: {
    ...chromaticModes,
  },
  render: headerTemplate,
};

export const MobileView: Story = {
  args: meta.args,
  globals: {
    viewport: "MD",
  },
  render: headerTemplate,
};

// Logo override: the default `<qgds-logo>` in the `logo` slot is replaced with an
// explicit one — here pinned to the "Delivering for Queensland" lockup. Consumers
// can equally supply a `custom-logo` for a co-brand or agency lockup.
export const LogoOverride: Story = {
  parameters: {
    ...chromaticModes,
  },
  render: () => html`
    ${demoNavStyles}
    <qgds-header
      site-name="Insert site name"
      @qgds-toggle-search-mobile=${onSearchToggle}
      @qgds-toggle-nav-menu=${onNavToggle}
    >
      <qgds-attribution-bar slot="pre-header" palette="bold">
        <qgds-link slot="site-name" target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
        <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
      </qgds-attribution-bar>

      <qgds-logo slot="logo" logo="coa-delivering-for-qld" alt="Queensland Government"></qgds-logo>

      <qgds-search-input slot="search" placeholder="Search this site"></qgds-search-input>

      ${demoNav}
    </qgds-header>
  `,
};
