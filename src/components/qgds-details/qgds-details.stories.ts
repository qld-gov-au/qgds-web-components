import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { action } from "storybook/actions";

import type { QGDSDetails } from "./qgds-details";
import "./qgds-details";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes, template } = getStorybookHelpers<QGDSDetails>("qgds-details");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSDetailsStoryArgs = typeof args;

const meta: Meta<QGDSDetailsStoryArgs> = {
  title: "Components/Details",
  component: "qgds-details",
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dictum efficitur egestas. Aenean sed pretium
        mauris.
      </p>`
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
      `
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
        story: "Open and close the details element, then inspect emitted events in the Actions panel.",
      },
    },
  },
  render: (storyArgs) => html`
    <div>
      <qgds-details
        summary-text="${storyArgs["summary-text"]}"
        size="${ifDefined(storyArgs.size)}"
        id="input-helper-1"
        name="whatever"
        data-test="2024-06-20"
      >
        <p>Open and close this disclosure, then check Storybook Actions.</p>
      </qgds-details>
    </div>
  `,
  play: ({ canvasElement }) => {
    // Storybook demo only.
    // Play executes when the story renders, or a control changes. We use this hook to:
    // 1. attach an event listener,
    // 2. listen for any dispatched "qgds-toggle" events,
    // 3. and log the event payload to the Actions panel

    // Other clients would use their own methods to listen for "qgds-toggle", and react to the event as needed.
    // thing.addEventListener("qgds-toggle", doSomething()}

    const logToggle = action("qgds-toggle");
    const details = canvasElement.querySelector("qgds-details");

    details?.addEventListener("qgds-toggle", (e) => {
      logToggle((e as CustomEvent).detail);
    });
  },
};
