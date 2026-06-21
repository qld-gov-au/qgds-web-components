import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSHeader } from "./qgds-header";
import "./qgds-header";
import "../qgds-attribution-bar/qgds-attribution-bar";
import "../qgds-link/qgds-link";
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

// The mobile Search/Menu buttons are presentational — they only dispatch
// `qgds-toggle`. The consumer reflects the requested state back onto the header
// via `search-open` / `menu-open`; this handler wires that up for the demo.
const onToggle = (e: Event) => {
  const { panel, open } = (e as CustomEvent<{ panel: "search" | "menu"; open: boolean }>).detail;
  const header = e.currentTarget as QGDSHeader;
  if (panel === "search") header.searchOpen = open;
  if (panel === "menu") header.menuOpen = open;
};

const headerTemplate = (args: Args) => html`
  <qgds-header site-name=${args["site-name"]} @qgds-toggle=${onToggle}>
    <qgds-attribution-bar slot="pre-header" palette="bold">
      <qgds-link slot="site-name" target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
      <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
    </qgds-attribution-bar>

    <qgds-search-input slot="search" placeholder="Search this site"></qgds-search-input>

    <nav
      slot="navigation"
      aria-label="Main navigation"
      style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center;"
    >
      <a href="#">Menu text</a>
      <a href="#">Menu text</a>
      <a href="#">Menu text</a>
      <a href="#">Menu text</a>
      <a href="#">Menu text</a>
    </nav>
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

// Co-brand usage: `site-name` is omitted, so the slotted `logo` (here a stand-in
// co-brand wordmark) sits beside the fixed coat-of-arms logo in the site name's
// place. A real consumer would slot their own logo component.
export const CoBrandLogo: Story = {
  parameters: {
    ...chromaticModes,
  },
  render: () => html`
    <qgds-header @qgds-toggle=${onToggle}>
      <qgds-attribution-bar slot="pre-header" palette="bold">
        <qgds-link slot="site-name" target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
        <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
      </qgds-attribution-bar>

      <span
        slot="logo"
        style="display:inline-flex; flex-direction:column; font-weight:800; font-style:italic; line-height:1; letter-spacing:.02em;"
      >
        <span style="font-size:1.5rem;">DELIVERING</span>
        <span style="font-size:0.75rem;">FOR QUEENSLAND</span>
      </span>

      <qgds-search-input slot="search" placeholder="Search this site"></qgds-search-input>

      <nav
        slot="navigation"
        aria-label="Main navigation"
        style="display:flex; flex-wrap:wrap; gap:1.5rem; align-items:center;"
      >
        <a href="#">Menu text</a>
        <a href="#">Menu text</a>
        <a href="#">Menu text</a>
      </nav>
    </qgds-header>
  `,
};
