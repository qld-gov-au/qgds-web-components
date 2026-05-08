import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";
import type { QGDSPromotionalPanel } from "./qgds-promotional-panel";
import "./qgds-promotional-panel";
import "../qgds-button/qgds-button";
import "../qgds-call-to-action/qgds-call-to-action";
const { args, argTypes, template } = getStorybookHelpers<QGDSPromotionalPanel>("qgds-promotional-panel");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Promotional Panel",
  component: "qgds-promotional-panel",
  tags: ["autodocs"],
  args: {
    ...args,
    promoType: "indent-text",
    promoImage: "https://picsum.photos/seed/qgds-beach/600/400",
    promoImageDescription: "Promotional image",
    contentAlignment: "content-left",
    icon: "design",
    promoPalette: "muted",
    title: "Title goes here and has a maximum of 65 character limit",
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
      promoType=${args.promoType}
      promoImage=${args.promoImage}
      promoImageDescription=${args.promoImageDescription}
      contentAlignment=${args.contentAlignment}
      icon=${args.icon}
      title=${args.title}
      abstract=${args.abstract}
      palette=${args.promoPalette}
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
