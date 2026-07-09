import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import { chromaticModes } from "../../../.storybook/modes";
import "./qgds-navigation";
import "../qgds-link-item/qgds-link-item";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { QGDSNavigation } from "./qgds-navigation";
import { withEventActions } from "../../../.storybook/storybook-helpers";

const { args, argTypes, template } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");
type Args = typeof args;

// ---------------------------------------------------------------------------
// Reusable nav items using the new nested qgds-link-item API
// ---------------------------------------------------------------------------

const navItems = html`
  <qgds-link-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-link-item>

  <qgds-link-item label="Services" href="#services" view-all-url="#services" view-all-label="View all services">
    <qgds-link-item label="Visiting someone in hospital" href="#visiting"></qgds-link-item>
    <qgds-link-item label="Going to hospital" href="#going"></qgds-link-item>
    <qgds-link-item label="Leaving hospital" href="#leaving"></qgds-link-item>
    <qgds-link-item label="Aboriginal and Torres Strait Islander support" href="#atsi"></qgds-link-item>
    <qgds-link-item label="Interpreter services" href="#interpreter"></qgds-link-item>
    <qgds-link-item label="Your health record" href="#records"></qgds-link-item>
  </qgds-link-item>

  <qgds-link-item label="Quit smoking" href="#quit" view-all-url="#quit" view-all-label="View all">
    <qgds-link-item
      label="Know your habits"
      href="#habits"
      description="Learn what makes you feel like smoking, how you can avoid triggers, and change your habits."
    ></qgds-link-item>
    <qgds-link-item
      label="What to expect"
      href="#expect"
      description="Learn how to manage withdrawal symptoms, stress and possible weight gain."
    ></qgds-link-item>
    <qgds-link-item
      label="Use quit tools and apps"
      href="#tools"
      description="Keep on track by using digital tools and apps for support, motivation and useful advice while quitting."
    ></qgds-link-item>
    <qgds-link-item
      label="Get help from Quitline"
      href="#quitline"
      description="Quitline is a telephone service dedicated to helping Queenslanders quit smoking."
    ></qgds-link-item>
  </qgds-link-item>

  <qgds-link-item label="About" href="#about"></qgds-link-item>
`;

const meta: Meta<Args> = {
  title: "Components/Navigation",
  component: "qgds-navigation",
  tags: ["autodocs"],
  args: {
    ...args,
    "aria-label": "main",
  },
  argTypes: {
    ...argTypes,
    variant: { control: "radio", options: argTypes.variant.options },
    orientation: { control: "radio", options: argTypes.orientation.options },
    "columns-direction": { control: "radio", options: argTypes["columns-direction"].options },
    columns: { control: { type: "range", min: 1, max: 3, step: 1 } },
  },
  render: (args) => template(args, navItems),
  decorators: [
    withEventActions([
      "qgds-navigation-open",
      "qgds-navigation-opened",
      "qgds-navigation-close",
      "qgds-navigation-closed",
    ]),
    (story) => {
      return html`${story()}
        <button
          class="qgds-mt-24"
          @click=${() => document.dispatchEvent(new CustomEvent("qgds-navigation-open", { bubbles: true }))}
        >
          Open mobile menu
        </button>`;
    },
  ],
};

export default meta;
type Story = StoryObj<Args>;

/** Default light horizontal navigation — link click opens the mega-menu dropdown. */
export const Default: Story = {
  args: { variant: "default", columns: 3 },
  parameters: { ...chromaticModes },
};

/** Dark horizontal navigation. */
export const Dark: Story = {
  args: { variant: "dark", columns: 3 },
  parameters: { ...chromaticModes },
};

/** Vertical layout — a chevron toggle button expands the dropdown inline. No header link repeated. */
export const Vertical: Story = {
  args: { variant: "default", orientation: "vertical", columns: 1 },
  parameters: { ...chromaticModes },
};

/** Dark vertical layout. */
export const DarkVertical: Story = {
  args: { variant: "dark", orientation: "vertical", columns: 1 },
  parameters: { ...chromaticModes },
};

/** Simple links — no dropdowns. */
export const SimpleLinks: Story = {
  args: { variant: "default", orientation: "horizontal", columns: 3 },
  render: (args) => html`
    <qgds-navigation
      variant="${args.variant}"
      orientation="${args.layout}"
      columns="${args.columns}"
      aria-label="${args["aria-label"]}"
    >
      <qgds-link-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-link-item>
      <qgds-link-item label="About" href="#about"></qgds-link-item>
      <qgds-link-item
        label="Services"
        href="/services"
        description="You can get help by phone, appointment at a service centre or, where possible, they can visit you in your home or another safe location."
        view-all-url="/services"
      >
        <qgds-link-item
          label="Planning and development"
          href="/planning"
          description="Apply for development approval, building permits and zoning information."
        ></qgds-link-item>
        <qgds-link-item
          label="Environment and sustainability"
          href="/environment"
          description="Protect Queensland's natural environment, water quality and biodiversity."
        ></qgds-link-item>
        <qgds-link-item
          label="Transport and motoring"
          href="/transport"
          description="Driver licences, vehicle registration, road rules and public transport."
        ></qgds-link-item>
        <qgds-link-item
          label="Health and wellbeing"
          href="/health"
          description="Access health services, mental health support and preventative care programs."
        ></qgds-link-item>
        <qgds-link-item
          label="Education and training"
          href="/education"
          description="Schools, TAFE, vocational training and early childhood education."
        ></qgds-link-item>
        <qgds-link-item
          label="Housing and homelessness"
          href="/housing"
          description="Find affordable housing, rental assistance and support for people at risk."
        ></qgds-link-item>
        <qgds-link-item
          label="Business and industry"
          href="/business"
          description="Start or grow a business, access grants and understand your obligations."
        ></qgds-link-item>
        <qgds-link-item
          label="Community and social services"
          href="/community"
          description="Support for families, older Queenslanders, people with disability and carers."
        ></qgds-link-item>
        <qgds-link-item
          label="Emergency management"
          href="/emergency"
          description="Prepare for disasters, report emergencies and find recovery assistance."
        ></qgds-link-item>
      </qgds-link-item>
      <qgds-link-item label="Contact" href="#contact"></qgds-link-item>
    </qgds-navigation>
  `,
};

/** Simple links — no dropdowns. */
export const SimpleLinks2: Story = {
  args: { variant: "default", layout: "horizontal", columns: 3 },
  render: (args) => html`
    <qgds-navigation
      variant="${args.variant}"
      orientation="${args.layout}"
      columns="${args.columns}"
      aria-label="${args["aria-label"]}"
    >
      <qgds-link-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-link-item>
      <qgds-link-item label="About" href="#about"></qgds-link-item>
      <qgds-link-item label="Services" href="/services" view-all-url="/services">
        <qgds-link-item label="Planning and development" href="/planning"></qgds-link-item>
        <qgds-link-item label="Environment and sustainability" href="/environment"></qgds-link-item>
        <qgds-link-item label="Transport and motoring" href="/transport"></qgds-link-item>
        <qgds-link-item label="Health and wellbeing" href="/health"></qgds-link-item>
        <qgds-link-item label="Education and training" href="/education"></qgds-link-item>
        <qgds-link-item label="Housing and homelessness" href="/housing"></qgds-link-item>
        <qgds-link-item label="Business and industry" href="/business"></qgds-link-item>
        <qgds-link-item label="Community and social services" href="/community"></qgds-link-item>
        <qgds-link-item label="Emergency management" href="/emergency"></qgds-link-item>
      </qgds-link-item>
      <qgds-link-item label="Contact" href="#contact"></qgds-link-item>
    </qgds-navigation>
  `,
};

/** Simple links — no dropdowns. */
export const SimpleLinks2Vertical: Story = {
  args: { variant: "default", layout: "vertical", columns: 3 },
  render: (args) => html`
    <qgds-navigation
      variant="${args.variant}"
      orientation="${args.layout}"
      columns="${args.columns}"
      aria-label="${args["aria-label"]}"
    >
      <qgds-link-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-link-item>
      <qgds-link-item label="About" href="#about"></qgds-link-item>
      <qgds-link-item label="Services" href="/services" view-all-url="/services">
        <qgds-link-item label="Planning and development" href="/planning"></qgds-link-item>
        <qgds-link-item label="Environment and sustainability" href="/environment"></qgds-link-item>
        <qgds-link-item label="Transport and motoring" href="/transport"></qgds-link-item>
        <qgds-link-item label="Health and wellbeing" href="/health"></qgds-link-item>
        <qgds-link-item label="Education and training" href="/education"></qgds-link-item>
        <qgds-link-item label="Housing and homelessness" href="/housing"></qgds-link-item>
        <qgds-link-item label="Business and industry" href="/business"></qgds-link-item>
        <qgds-link-item label="Community and social services" href="/community"></qgds-link-item>
        <qgds-link-item label="Emergency management" href="/emergency"></qgds-link-item>
      </qgds-link-item>
      <qgds-link-item label="Contact" href="#contact"></qgds-link-item>
    </qgds-navigation>
  `,
};
