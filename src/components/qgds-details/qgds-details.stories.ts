import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { action } from "storybook/actions";

import type { QGDSDetails } from "./qgds-details.ts";
import "./qgds-details.ts";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSDetails>("qgds-details");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSDetailsStoryArgs = typeof args;

const meta: Meta<QGDSDetailsStoryArgs> = {
  title: "Components/QGDS Details",
  tags: ["autodocs"],
  args: {
    ...args,
    "summary-text": "More information",
  },
  argTypes,
  render: (storyArgs) =>
    template(
      storyArgs,
      html`<p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum efficitur egestas.
        Aenean sed pretium mauris.
      </p>`,
    ),
};

export default meta;
type Story = StoryObj<QGDSDetailsStoryArgs>;

export const Default: Story = {
  args: {
    "summary-text": "More information",
  },
};

/** All size variants */
export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <qgds-details summary-text="Tiny (xs)" size="xs">
        <p>Content inside a small details component.</p>
      </qgds-details>
      <qgds-details summary-text="Small (sm)" size="sm">
        <p>Content inside a small details component.</p>
      </qgds-details>
      <qgds-details summary-text="Medium (md)" size="md">
        <p>Content inside a medium details component.</p>
      </qgds-details>
      <qgds-details summary-text="Large (lg)" size="lg">
        <p>Content inside a large details component.</p>
      </qgds-details>
    </div>
  `,
};

/** Rich slot content with lists and links */
export const RichContent: Story = {
  args: {
    "summary-text": "What documents do I need?",
    size: "md",
  },
  render: (storyArgs) =>
    template(
      storyArgs,
      html`
        <ul>
          <li>Proof of identity (passport or driver licence)</li>
          <li>Recent utility bill or bank statement</li>
          <li>Tax file number — <a href="#">how to find your TFN</a></li>
        </ul>
      `,
    ),
};

/** Listen for qgds-toggle in light DOM and display received payloads. */
export const EventDispatch: Story = {
  args: {
    "summary-text": "Toggle to dispatch event",
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open and close the details element, then inspect emitted events in the Actions panel.",
      },
    },
  },
  render: (storyArgs) => {
    // Storybook action logger for "qgds-toggle" events - see Actions Tab in Storybook UI
    const logQgdsToggle = action("qgds-toggle");

    return html`
      <div>
        <qgds-details
          summary-text="${storyArgs["summary-text"]}"
          size="${ifDefined(storyArgs.size)}"
          @qgds-toggle=${(e: CustomEvent) => logQgdsToggle(e.detail)}>
          <p>Open and close this disclosure, then check Storybook Actions.</p>
        </qgds-details>
      </div>
    `;
  },
};
