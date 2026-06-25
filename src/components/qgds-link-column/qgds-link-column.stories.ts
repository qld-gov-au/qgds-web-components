import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSLinkColumn } from "./qgds-link-column.js";
import "./qgds-link-column.js";
import "../qgds-link-item/qgds-link-item.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSLinkColumn>("qgds-link-column");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Link Column",
  component: "qgds-link-column",
  tags: ["autodocs"],
  args: {
    ...args,
    columns: 3,
    layout: "vertical",
    "view-all-label": "View all services",
    "view-all-url": "#",
  },
  argTypes: {
    ...argTypes,
    columns: { control: { type: "range", min: 1, max: 3, step: 1 } },
    layout: { control: "radio", options: ["vertical", "horizontal"] },
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
        <qgds-link-item label="Heavy vehicle accreditation" href="#heavy-vehicle"></qgds-link-item>
        <qgds-link-item label="Boat registration" href="#boat-registration"></qgds-link-item>
        <qgds-link-item label="Driving history" href="#driving-history"></qgds-link-item>
        <qgds-link-item label="Road rules and safety" href="#road-rules"></qgds-link-item>
      `
    ),
};

export default meta;

type Story = StoryObj<Args>;

/** Default link column with vertical multi-column layout. */
export const Default: Story = {
  args: {
    columns: 3,
    layout: "vertical",
    "view-all-label": "View all services",
    "view-all-url": "#",
  },
};

/** Link column with no aria-label — the nav landmark uses the generic fallback (triggers a console warning). */
export const NoAriaLabel: Story = {
  args: {
    columns: 2,
    layout: "vertical",
    "view-all-label": "View all services",
    "view-all-url": "#",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

/** Link column with an explicit aria-label to satisfy WCAG 2.4.1. */
export const WithAriaLabel: Story = {
  name: "With aria-label",
  args: {
    "aria-label": "Transport services",
    columns: 2,
    layout: "vertical",
    "view-all-label": "View all services",
    "view-all-url": "#",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

/** Link column with a View All call-to-action at the bottom. */
export const WithViewAll: Story = {
  args: {
    columns: 2,
    layout: "vertical",
    "view-all-label": "View all transport services",
    "view-all-url": "#view-all",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

/** Two-column layout with description text on each item. */
export const WithDescription: Story = {
  args: {
    columns: 2,
    layout: "vertical",
    "view-all-label": "View all services",
    "view-all-url": "#",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item
          label="Driver licence"
          href="#driver-licence"
          description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penat."
        ></qgds-link-item>
        <qgds-link-item
          label="Vehicle registration"
          href="#vehicle-registration"
          description="Register, transfer or cancel your vehicle registration"
        ></qgds-link-item>
        <qgds-link-item
          label="Learner licence"
          href="#learner-licence"
          description="Get your learner licence and start your driving journey"
        ></qgds-link-item>
        <qgds-link-item label="Pay a fine" href="#pay-fine" description="Pay"></qgds-link-item>
        <qgds-link-item
          label="Book a health appointment"
          href="#health-appointment"
          description="Find and book appointments with Queensland Health services including hospitals, clinics and community health centres"
        ></qgds-link-item>
        <qgds-link-item
          label="Boat registration"
          href="#boat-registration"
          description="Register your vessel"
        ></qgds-link-item>
        <qgds-link-item
          label="Apply for a business licence"
          href="#business-licence"
          description="Search, apply for and manage licences and permits required to operate your business in Queensland, including food business licences, liquor licences and environmental authorities"
        ></qgds-link-item>
        <qgds-link-item
          label="Update your address"
          href="#update-address"
          description="Update your residential and postal address across multiple Queensland Government services at once"
        ></qgds-link-item>
        <qgds-link-item
          label="Concession card"
          href="#concession-card"
          description="Check eligibility"
        ></qgds-link-item>
        <qgds-link-item
          label="Road rules and safety"
          href="#road-rules"
          description="Learn about Queensland road rules, speed limits, mobile phone laws, seatbelt requirements and penalties for traffic offences"
        ></qgds-link-item>
        <qgds-link-item
          label="Birth certificate"
          href="#birth-certificate"
          description="Order a certified copy of a Queensland birth certificate for yourself or your child"
        ></qgds-link-item>
        <qgds-link-item label="Report a pothole" href="#report-pothole" description="Report"></qgds-link-item>
        <qgds-link-item
          label="Access your tax records"
          href="#tax-records"
          description="View and download your Queensland payroll tax, land tax and duties records and lodge returns through the online portal"
        ></qgds-link-item>
      `
    ),
};

/** Three-column vertical layout with many links — a typical popular services component. */
export const SimpleLinks: Story = {
  args: {
    columns: 3,
    layout: "vertical",
    "view-all-label": "View all",
    "view-all-url": "#view-all",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Pay a fine" href="#"></qgds-link-item>
        <qgds-link-item label="Register to vote" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a grant" href="#"></qgds-link-item>
        <qgds-link-item label="Book a health appointment" href="#"></qgds-link-item>
        <qgds-link-item label="Renew your passport" href="#"></qgds-link-item>
        <qgds-link-item label="Update your address" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a business licence" href="#"></qgds-link-item>
        <qgds-link-item label="Check your rates" href="#"></qgds-link-item>
        <qgds-link-item label="Report an issue" href="#"></qgds-link-item>
        <qgds-link-item label="Access your tax records" href="#"></qgds-link-item>
        <qgds-link-item label="Find a service centre" href="#"></qgds-link-item>
        <qgds-link-item label="Submit a complaint" href="#"></qgds-link-item>
      `
    ),
};

/** Three-column horizontal layout — links flow left-to-right across columns. */
export const SimpleLinksHorizontal: Story = {
  args: {
    columns: 3,
    layout: "horizontal",
    "view-all-label": "View all",
    "view-all-url": "#view-all",
  },
  render: (args) =>
    template(
      args,
      html`
        <qgds-link-item label="Pay a fine" href="#"></qgds-link-item>
        <qgds-link-item label="Register to vote" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a grant" href="#"></qgds-link-item>
        <qgds-link-item label="Book a health appointment" href="#"></qgds-link-item>
        <qgds-link-item label="Renew your passport" href="#"></qgds-link-item>
        <qgds-link-item label="Update your address" href="#"></qgds-link-item>
        <qgds-link-item label="Apply for a business licence" href="#"></qgds-link-item>
        <qgds-link-item label="Check your rates" href="#"></qgds-link-item>
        <qgds-link-item label="Report an issue" href="#"></qgds-link-item>
        <qgds-link-item label="Access your tax records" href="#"></qgds-link-item>
        <qgds-link-item label="Find a service centre" href="#"></qgds-link-item>
        <qgds-link-item label="Submit a complaint" href="#"></qgds-link-item>
      `
    ),
};
