import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { ref } from "lit/directives/ref.js";
import "../qgds-icon/qgds-icon.ts";
import { ICON_NAMES } from "../qgds-icon/icon-names";
import "./qgds-button.ts";
import { QGDSButtonProps } from "./qgds-button";

// Extended interface for story-specific props
interface StoryButtonProps extends QGDSButtonProps {
  iconId?: string;
}

/** QGDS Button Web Component */
const renderButton = ({
  label,
  disabled,
  target,
  ariaLabel,
  trailingIcon,
  variant,
  href,
  loadingLabel,
  isLoading,
  eventTitle,
  uniqueID,
  iconId,
  iconSize,
  type,
}: StoryButtonProps) => {
  // Create a handler that logs the event to console
  const handleEvent = (e: CustomEvent) => {
    // eslint-disable-next-line no-console
    console.log(`✅ Event "${e.type}" bubbled up to light DOM`);
    // eslint-disable-next-line no-console
    console.log(`   Full event detail:`, e.detail);
  };

  const attachListener = (el?: Element) => {
    if (el) {
      el.addEventListener(
        eventTitle ?? "onClick",
        handleEvent as EventListener,
      );
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
        <qgds-icon
          slot="icon"
          iconId="${iconId}"
          size="${iconSize}"
          aria-label="${ifDefined(ariaLabel)}"
        >
        </qgds-icon>
      </qgds-button>
    </div>
  `;
};

const meta: Meta<StoryButtonProps> = {
  title: "Components/QGDS Button",
  tags: ["autodocs"],
  render: (args) => renderButton(args),
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
      name: "button variant type",
      description: "The Button variant type",
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    label: {
      control: "text",
      description: "This is the Button content",
    },
    disabled: {
      control: "boolean",
      name: "disabled",
      description: "Whether the button is disabled",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    target: {
      control: "select",
      name: "target",
      options: ["_self", "_blank", "_parent", "_top"],
      if: { arg: "href", truthy: true },
    },
    ariaLabel: {
      control: "text",
      name: "aria-label",
      description: "The Button aria-label attribute",
    },
    iconId: {
      control: "select",
      options: [...ICON_NAMES],
      description: "The icon to display in the button",
      table: {
        category: "QGDS Icon",
      },
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
      description: "The button type attribute",
      if: { arg: "href", truthy: false },
    },
    iconSize: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "The size of the icon",
      table: {
        category: "QGDS Icon",
      },
    },
    trailingIcon: {
      control: "boolean",
      name: "has trailing icon",
      description: "Whether the button has a trailing icon",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    href: {
      control: "text",
      description: "The URL for the button if it is a link",
      table: {
        defaultValue: { summary: "" },
      },
    },
    loadingLabel: {
      control: "text",
      name: "loading label",
      description: "The text that appears when the button is loading",
      if: { arg: "href", truthy: false },
      table: {
        defaultValue: { summary: "Loading..." },
      },
    },
    isLoading: {
      control: "boolean",
      name: "is loading",
      description: "Whether the button is in a loading state",
      if: { arg: "href", truthy: false },
      table: {
        defaultValue: { summary: "false" },
      },
      type: "boolean",
    },
    eventTitle: {
      control: "text",
      name: "event title",
      description: "The event title for the qgds-button, e.g., onClick",
      table: {
        defaultValue: { summary: "onClick" },
      },
    },
    uniqueID: {
      control: "text",
      description: "The unique identifier for the qgds-button",
      name: "unique ID",
      table: {
        defaultValue: { summary: "onClick" },
      },
    },
  },
  globals: {
    backgrounds: { value: "default" },
  },
};

export default meta;
type Story = StoryObj<StoryButtonProps>;

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
        <qgds-icon slot="icon" iconid="external-link" size="md"></qgds-icon>
      </qgds-button>
      <qgds-button label="QGDS Button" variant="secondary">
        <qgds-icon slot="icon" iconid="external-link" size="md"></qgds-icon>
      </qgds-button>
      <qgds-button label="QGDS Button" variant="tertiary">
        <qgds-icon slot="icon" iconid="external-link" size="md"></qgds-icon>
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
