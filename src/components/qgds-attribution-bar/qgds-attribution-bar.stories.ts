import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSAttributionBar } from "./qgds-attribution-bar";
import "./qgds-attribution-bar";
import "../qgds-link/qgds-link";

const { args, argTypes, template } = getStorybookHelpers<QGDSAttributionBar>("qgds-attribution-bar");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Attribution Bar",
  component: "qgds-attribution-bar",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {
  args: meta.args,
  parameters: {
    ...chromaticModes,
  },
  render: (args) => html`
    <style>
      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-toggle {
        cursor: pointer;
        list-style: none;
      }

      .dropdown-toggle qgds-link {
        --qgds-link-decoration: none;
      }

      .dropdown-toggle::-webkit-details-marker {
        display: none;
      }

      .dropdown-menu {
        position: absolute;
        top: 28px;
        right: 0;
        min-width: 268px;
        padding: 16px 28px;
        background: white;
        display: none;
        flex-direction: column;
        gap: 1rem;
        background-color: var(--qgds-color-background-shade);
      }

      .dropdown[open] .dropdown-menu {
        display: flex;
      }
    </style>
    <qgds-attribution-bar palette=${args.palette}>
      <qgds-link slot="site-name" target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
      <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
      <qgds-link href="https://www.qld.gov.au/services" label="Find services"></qgds-link>
      <div>
        <details class="dropdown">
          <summary class="dropdown-toggle">
            <qgds-link label="Custom Menu"></qgds-link>
          </summary>

          <div class="dropdown-menu">
            <a href="#">Profile</a>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
          </div>
        </details>
      </div>
    </qgds-attribution-bar>
  `,
};
