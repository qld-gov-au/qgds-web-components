import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSPromotionalPanel } from "./qgds-promotional-panel";
import "./qgds-promotional-panel";
import "../qgds-button/qgds-button";
import "../qgds-call-to-action/qgds-call-to-action";
import { palettes } from "../../utils";
import { ICON_NAMES } from "../qgds-icon/icon-names.js";
const { args, argTypes, template } = getStorybookHelpers<QGDSPromotionalPanel>("qgds-promotional-panel");

argTypes["icon-name"] = {
  control: "select",
  options: ICON_NAMES,
} as const;

argTypes.palette = {
  control: { type: "select" },
  options: [...Object.keys(palettes).filter((key) => key !== "soft")],
};

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Promotional Panel",
  component: "qgds-promotional-panel",
  tags: ["autodocs"],
  args: {
    ...args,
    variant: "indent-text",
    "image-url": "https://picsum.photos/seed/qgds-beach/600/400",
    "image-description": "Promotional image",
    "content-alignment": "content-start",
    "icon-name": "home",
    heading: "Title goes here and has a maximum of 65 character limit",
    "heading-level": "h2",
    abstract: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor, leo vulputate ut odio mattis.",
  },
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
    <qgds-promotional-panel
      variant=${args.variant}
      image-url=${args["image-url"]}
      image-description=${args["image-description"]}
      content-alignment=${args["content-alignment"]}
      icon-name=${args["icon-name"]}
      heading=${args.heading}
      heading-level=${args["heading-level"]}
      abstract=${args.abstract}
      palette=${args.palette}
    >
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tortor, leo vulputate ut odio mattis. Vel
        suspendisse mi quisque consequat aliquet egestas.
      </p>
      <qgds-call-to-action slot="footer-ctalinks" href="#" label="CTA Link"></qgds-call-to-action>

      <qgds-button
        slot="footer-buttons"
        target="_self"
        type="button"
        aria-label="Primary Action"
        label="Primary"
        variant="primary"
        href="https://www.qld.gov.au"
        id=""
      >
      </qgds-button>
      <qgds-button
        slot="footer-buttons"
        target="_self"
        type="button"
        aria-label="Secondary Action"
        label="Secondary"
        variant="secondary"
        href="https://www.qld.gov.au"
        id=""
      >
      </qgds-button>
    </qgds-promotional-panel>
  `,
};
