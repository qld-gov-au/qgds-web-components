import { html } from "lit";
import type { Meta, StoryObj } from "@storybook/web-components";
import "./qgds-call-to-action.js";
import type { QgdsCallToAction } from "./qgds-call-to-action.js";


const meta: Meta<QgdsCallToAction> = {
  title: "Components/Call To Action",
  component: "qgds-call-to-action",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    href: { control: "text" },
    isViewAll: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<QgdsCallToAction>;

export const Default: Story = {
  args: { label: "View all", href: "#", isViewAll: true },
  render: ({ label, href, isViewAll }) => html`
    <qgds-call-to-action label=${label} href=${href} ?is-view-all=${isViewAll}></qgds-call-to-action>
  `,
};
