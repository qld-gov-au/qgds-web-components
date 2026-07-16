import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import { ICON_NAMES } from "../qgds-icon/icon-names";
import type { IconName } from "../qgds-icon/icon-names";
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
  "icon-name"?: IconName;
};

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled,
  target,
  "aria-label": ariaLabel,
  "icon-position": iconPosition,
  variant,
  href,
  "loading-label": loadingLabel,
  "is-loading": isLoading,
  "event-title": eventTitle,
  id: uniqueID,
  "icon-name": iconName,
  type,
}: QGDSButtonStoryArgs) => {
  const resolvedLoadingLabel =
    typeof loadingLabel === "string" && loadingLabel.trim().length > 0 ? loadingLabel : undefined;

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
        id="${ifDefined(uniqueID)}"
        target=${ifDefined(href ? target : undefined)}
        href="${ifDefined(href)}"
        type=${ifDefined(href ? undefined : type)}
        aria-label="${ifDefined(ariaLabel ?? undefined)}"
        label="${label}"
        .iconName=${iconName}
        icon-position="${ifDefined(iconPosition)}"
        variant="${ifDefined(variant)}"
        loading-label="${ifDefined(resolvedLoadingLabel)}"
        ?is-loading=${ifDefined(isLoading)}
        event-title="${ifDefined(eventTitle)}"
      ></qgds-button>
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
    "icon-name": {
      control: "select",
      options: [...ICON_NAMES],
      description: "The icon to display in the button",
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

export const AllButtons: Story = {
  args: {
    label: "Default",
  },
  decorators: [
    (story) => {
      return html`
        <style>
          .sb-button-grid {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 2rem;
          }
          h3 {
            margin-bottom: 0.5rem;
            font-weight: normal;
          }
        </style>

        ${story()}
      `;
    },
  ],
  render: () => html`
    <h3>Primary</h3>
    <div class="sb-button-grid">
      <qgds-button>My Button</qgds-button>
      <!-- ...or with label -->
      <qgds-button label="Leading Icon" variant="primary" icon-name="external-link"></qgds-button>
      <qgds-button
        label="Trailing Icon"
        variant="primary"
        icon-name="external-link"
        icon-position="trailing"
      ></qgds-button>
      <qgds-button label="Disabled" variant="primary" disabled></qgds-button>
      <qgds-button label="QGDS Button" variant="primary" loading-label="Loading" is-loading> </qgds-button>
    </div>

    <h3>Secondary</h3>
    <div class="sb-button-grid">
      <qgds-button label="Button" variant="secondary"></qgds-button>
      <qgds-button label="Leading Icon" variant="secondary" icon-name="external-link"></qgds-button>
      <qgds-button
        label="Trailing Icon"
        variant="secondary"
        icon-name="external-link"
        icon-position="trailing"
      ></qgds-button>
      <qgds-button label="Disabled" variant="secondary" disabled></qgds-button>
      <qgds-button label="QGDS Button" variant="secondary" loading-label="Loading" is-loading> </qgds-button>
    </div>

    <h3>Tertiary</h3>
    <div class="sb-button-grid">
      <qgds-button label="Button" variant="tertiary"></qgds-button>
      <qgds-button label="Leading Icon" variant="tertiary" icon-name="external-link"></qgds-button>
      <qgds-button
        label="Trailing Icon"
        variant="tertiary"
        icon-name="external-link"
        icon-position="trailing"
      ></qgds-button>
      <qgds-button label="Disabled" variant="tertiary" disabled></qgds-button>
      <qgds-button label="QGDS Button" variant="tertiary" loading-label="Loading" is-loading> </qgds-button>
    </div>
  `,
};

export const Button: Story = {
  args: {
    label: "QGDS Button",
    "icon-name": "external-link",
    variant: "primary",
    type: "button",
  },
};
