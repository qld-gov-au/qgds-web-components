import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSAttributionBar } from "./qgds-attribution-bar";
import "./qgds-attribution-bar";
import "./qgds-custom-html";
import "../qgds-link/qgds-link";
import { palettes } from "../../utils";

const { args, argTypes, template } = getStorybookHelpers<QGDSAttributionBar>("qgds-attribution-bar");

type Args = typeof args;
type Story = StoryObj<Args>;

argTypes.palette = {
  control: { type: "select" },
  options: [...Object.keys(palettes)],
};

const meta: Meta<Args> = {
  title: "Components/Attribution Bar",
  component: "qgds-attribution-bar",
  subcomponents: {
    "QGDS Custom HTML": "qgds-custom-html",
  },
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
      <qgds-link target="_blank" href="https://www.qld.gov.au" label="qld.gov.au"></qgds-link>
      <qgds-link
        slot="attribution"
        icon-name="phone"
        href="https://www.qld.gov.au/contact-us"
        label="Contact us"
      ></qgds-link>
      <qgds-link slot="attribution" href="https://www.qld.gov.au/services" label="Find services"></qgds-link>

      <qgds-custom-html slot="custom">
        <details class="dropdown">
          <summary class="dropdown-toggle">
            <qgds-link label="Menu"></qgds-link>
          </summary>

          <div class="dropdown-menu">
            <a href="#">Profile</a>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
          </div>
        </details>
      </qgds-custom-html>
    </qgds-attribution-bar>
  `,
};
