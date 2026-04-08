import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import "../qgds-icon/qgds-icon";
import { ICON_NAMES } from "../qgds-icon/icon-names";
import type { QGDSButton } from "./qgds-button";
import "./qgds-button";

// Get auto-generated args, argTypes, and template from Custom Elements Manifest
// The template function handles attribute/property name mapping automatically
const { args, argTypes } = getStorybookHelpers<QGDSButton>("qgds-button");

/**
 * Storybook args interface using kebab-case attribute names from CEM.
 * This matches the format returned by getStorybookHelpers.
 */
type QGDSButtonStoryArgs = typeof args & {
  iconId?: string;
  iconSize?: string;
};

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled,
  target,
  "aria-label": ariaLabel,
  "trailing-icon": trailingIcon,
  variant,
  href,
  "loading-label": loadingLabel,
  "is-loading": isLoading,
  "event-title": eventTitle,
  id: uniqueID,
  iconId,
  iconSize,
  type,
}: QGDSButtonStoryArgs) => {
  // Create a handler that logs the event to console
  const handleEvent = (e: CustomEvent) => {
    // eslint-disable-next-line no-console
    console.log(`✅ Event "${e.type}" bubbled up to light DOM`);
    // eslint-disable-next-line no-console
    console.log(`   Full event detail:`, e.detail);
  };

  const attachListener = (el?: Element) => {
    if (el) {
      el.addEventListener(eventTitle ?? "onClick", handleEvent as EventListener);
    }
  };

  return html`
    <div ${ref(attachListener)}>
      <qgds-button
        ?disabled=${disabled ?? false}
        target="${ifDefined(target)}"
        type=${ifDefined(href ? undefined : type)}
        aria-label="${ifDefined(ariaLabel ?? undefined)}"
        label="${label}"
        ?trailing-icon=${trailingIcon}
        variant="${variant}"
        href="${ifDefined(href)}"
        loading-label="${ifDefined(loadingLabel)}"
        ?is-loading=${isLoading}
        event-title="${ifDefined(eventTitle)}"
        id="${ifDefined(uniqueID)}"
      >
        <qgds-icon slot="icon" icon-id="${iconId}" size="${iconSize}" aria-label="${ifDefined(ariaLabel)}"> </qgds-icon>
      </qgds-button>
    </div>
  `;
};

const meta: Meta<QGDSButtonStoryArgs> = {
  title: "Components/Button",
  component: "qgds-button",
  tags: ["autodocs"],
  args: {
    ...args,
    label: "QGDS Button",
    variant: "primary",
  },
  argTypes: {
    ...argTypes,
    iconId: {
      control: "select",
      options: [...ICON_NAMES],
      description: "The icon to display in the button",
      table: {
        category: "QGDS Icon",
      },
    },
    iconSize: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the icon",
      table: {
        category: "QGDS Icon",
      },
    },
  },
  render: (storyArgs) => renderButton(storyArgs),
  globals: {
    backgrounds: { value: "default" },
  },
};

export default meta;
type Story = StoryObj<QGDSButtonStoryArgs>;

export const Button: Story = {
  args: {
    label: "QGDS Button",
    iconId: "external-link",
    iconSize: "md",
    variant: "primary",
    type: "button",
  },
};

export const Default: Story = {
  args: {
    label: "Default",
  },
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <qgds-button label="QGDS Button" variant="primary">
        <qgds-icon slot="icon" icon-id="external-link" size="md"></qgds-icon>
      </qgds-button>
      <qgds-button label="QGDS Button" variant="secondary">
        <qgds-icon slot="icon" icon-id="external-link" size="md"></qgds-icon>
      </qgds-button>
      <qgds-button label="QGDS Button" variant="tertiary">
        <qgds-icon slot="icon" icon-id="external-link" size="md"></qgds-icon>
      </qgds-button>
    </div>
  `,
};

export const NoIcon: Story = {
  args: {
    label: "No icon",
  },
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <qgds-button label="QGDS Button" variant="primary"></qgds-button>
      <qgds-button label="QGDS Button" variant="secondary"></qgds-button>
      <qgds-button label="QGDS Button" variant="tertiary"></qgds-button>
    </div>
  `,
};
