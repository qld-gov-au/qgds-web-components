import type { Meta, StoryObj } from "@storybook/web-components";
import { html, type TemplateResult } from "lit";
import "./qgds-link-column.js";
import "../qgds-link-item/qgds-link-item.js";
import type { LinkColumnDirection } from "./qgds-link-column.js";

const meta: Meta = {
  title: "Components/Link Column",
  tags: ["autodocs"],
  argTypes: {
    heading: { control: "text" },
    ariaLabel: { control: "text" },
    headingLevel: { control: { type: "range", min: 1, max: 6, step: 1 } },
    columns: { control: { type: "range", min: 1, max: 3, step: 1 } },
    direction: { control: "radio", options: ["vertical", "horizontal"] },
    hasViewAll: { control: "boolean" },
    viewAllLabel: { control: "text" },
    viewAllURL: { control: "text" },
  },
};

export default meta;
type Story = StoryObj;

const col = (args: Record<string, unknown>, children: TemplateResult) => html`
  <qgds-link-column
    .heading=${args.heading}
    .ariaLabel=${args.ariaLabel}
    .headingLevel=${(args.headingLevel as number) ?? 3}
    .columns=${args.columns}
    .direction=${args.direction as LinkColumnDirection}
    .hasViewAll=${args.hasViewAll as boolean}
    .viewAllLabel=${args.viewAllLabel}
    .viewAllURL=${args.viewAllURL}
  >
    ${children}
  </qgds-link-column>
`;

export const Default: Story = {
  args: {
    heading: "Transport and motoring",
    columns: 3,
    direction: "vertical",
    hasViewAll: false,
    viewAllLabel: "View all services",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
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

export const NoHeading: Story = {
  args: {
    columns: 2,
    direction: "vertical",
    hasViewAll: false,
    viewAllLabel: "View all services",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

export const NoHeadingWithAriaLabel: Story = {
  name: "No Heading (with aria-label)",
  args: {
    ariaLabel: "Transport services",
    columns: 2,
    direction: "vertical",
    hasViewAll: false,
    viewAllLabel: "View all services",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

export const WithViewAll: Story = {
  args: {
    heading: "Transport and motoring",
    columns: 2,
    direction: "vertical",
    hasViewAll: true,
    viewAllLabel: "View all transport services",
    viewAllURL: "#view-all",
  },
  render: (args) =>
    col(
      args,
      html`
        <qgds-link-item label="Driver licence" href="#driver-licence"></qgds-link-item>
        <qgds-link-item label="Vehicle registration" href="#vehicle-registration"></qgds-link-item>
        <qgds-link-item label="Learner licence" href="#learner-licence"></qgds-link-item>
      `
    ),
};

export const WithDescription: Story = {
  args: {
    heading: "Transport and motoring",
    columns: 1,
    direction: "vertical",
    hasViewAll: false,
    viewAllLabel: "View all services",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
      args,
      html`
        <qgds-link-item
          label="Driver licence"
          href="#driver-licence"
          description="Apply for, renew or replace your driver licence"
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

export const SimpleLinks: Story = {
  args: {
    heading: "Popular services",
    columns: 3,
    direction: "vertical",
    hasViewAll: true,
    viewAllLabel: "View all",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
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

export const SimpleLinksHorizontal: Story = {
  args: {
    heading: "Popular services",
    columns: 3,
    direction: "horizontal",
    hasViewAll: true,
    viewAllLabel: "View all",
    viewAllURL: "#",
  },
  render: (args) =>
    col(
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
