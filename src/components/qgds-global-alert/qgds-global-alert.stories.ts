import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { chromaticModes } from "../../../.storybook/modes";

import "./qgds-global-alert";
import type { QGDSGlobalAlert } from "./qgds-global-alert";

const { args, argTypes } = getStorybookHelpers<QGDSGlobalAlert>("qgds-global-alert");

type Args = typeof args;
type Story = StoryObj<Args>;

const storyRender = (args: Args) => html`
  <qgds-global-alert
    variant="${ifDefined(args.variant)}"
    heading="${ifDefined(args.heading)}"
    action-label="${ifDefined(args["action-label"])}"
    action-href="${ifDefined(args["action-href"])}"
    .isDismissible="${args["is-dismissible"] ?? false}"
    >${unsafeHTML(String(args["default-slot"] ?? ""))}</qgds-global-alert
  >
`;

const meta: Meta<Args> = {
  title: "Components/Global alert",
  component: "qgds-global-alert",
  tags: ["autodocs"],
  args: {
    ...args,
    variant: "warning",
    heading: "Site notice",
    "action-label": "Learn more",
    "action-href": "#",
    "is-dismissible": true,
    "default-slot": "<p>This website is currently undergoing testing</p>",
  },
  argTypes,
  render: storyRender,
};

export default meta;

export const Warning: Story = {
  args: {
    ...meta.args,
    variant: "warning",
    heading: "Site notice",
    "default-slot": "<p>This website is currently undergoing testing</p>",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const Critical: Story = {
  args: {
    ...meta.args,
    variant: "critical",
    heading: "Health alert",
    "default-slot": "<p>Disease outbreak reported in your area</p>",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const General: Story = {
  args: {
    ...meta.args,
    variant: "general",
    heading: "Update",
    "default-slot": "<p>New features are now available</p>",
  },
  parameters: {
    ...chromaticModes,
  },
};

export const NoDismiss: Story = {
  args: {
    ...meta.args,
    "is-dismissible": false,
  },
  parameters: {
    ...chromaticModes,
  },
};

export const NoAction: Story = {
  args: {
    ...meta.args,
    "action-label": undefined,
    "action-href": undefined,
  },
  parameters: {
    ...chromaticModes,
  },
};

export const NoHeading: Story = {
  args: {
    ...meta.args,
    heading: undefined,
  },
  parameters: {
    ...chromaticModes,
  },
};

export const AllVariants: Story = {
  parameters: {
    ...chromaticModes,
  },
  decorators: [(story) => html`<div style="display:flex;flex-direction:column;">${story()}</div>`],
  render: () => html`
    <qgds-global-alert variant="critical" heading="Health alert" action-label="Learn more" action-href="#">
      <p>Disease outbreak reported in your area</p>
    </qgds-global-alert>

    <qgds-global-alert variant="warning" heading="Site notice" action-label="Learn more" action-href="#">
      <p>This website is currently undergoing testing</p>
    </qgds-global-alert>

    <qgds-global-alert variant="general" heading="Update" action-label="Learn more" action-href="#">
      <p>New features are now available</p>
    </qgds-global-alert>
  `,
};
