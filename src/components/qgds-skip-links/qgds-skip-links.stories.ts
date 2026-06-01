import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { html } from "lit";
import type { QGDSSkipLinks } from "./qgds-skip-links.js";
import "./qgds-skip-links.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSSkipLinks>("qgds-skip-links");

type Args = typeof args;

const meta: Meta<Args> = {
  title: "Components/Skip Links",
  component: "qgds-skip-links",
  tags: ["autodocs"],
  args: {
    ...args
  },
  argTypes: {
    ...argTypes,
    ariaLabel: { control: "text" },
  },
  render: (args) => template(args),
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  decorators: [
    (story) => {
      return html`
        <p>
          To show 'Skip Links' component, click on this text to focus it, then press the Tab key to see the skip links appear.
        </p>
        ${story()}
        `;
    },
  ],
};

export const SkipToMainContent: Story = {
  args: {
    ariaLabel: "Skip to main content",
  },
  decorators: [
    (story) => {

      const isStandaloneIframe = window === window.top;
      if (isStandaloneIframe) {
        return html`<p>
            To show 'Skip Links' component, click on this text to focus it, then press the Tab key to see the skip links appear.
          </p>
          ${story()}
          <nav id="main-nav" style="margin-block-start: 50rem;">
            <div class="nav-header" style="font-size: 1.25rem; font-weight: bold; margin-block-end: 1rem;">Main Navigation</div>
            <ul style="list-style:none;margin:0;padding:0; display:flex; gap:1rem;">
              <li><a href="https://www.qld.gov.au/education">Education</a></li>
              <li><a href="https://www.qld.gov.au/health">Health</a></li>
              <li><a href="https://www.qld.gov.au/housing">Housing</a></li>
              <li><a href="https://www.qld.gov.au/seniors">Seniors</a></li>
              <li><a href="https://www.qld.gov.au/transport">Transport</a></li>
              <li><a href="https://www.qld.gov.au/youth">Youth</a></li>
            </ul>
          </nav>
          <main id="main-content" style="margin-block-start: 5rem; margin-block-end: 100rem;">
            <h1>Main Content</h1>
            <p style="margin-block-start: 1rem;">This is the main content area. The "Skip to main content" link will jump to this section.</p>
            <p style="margin-block-start: 1rem;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pellentesque, augue gravida bibendum varius, leo augue tincidunt libero, in blandit sapien sapien ut tortor. 
            Aliquam aliquet pretium convallis. Mauris et neque gravida, accumsan nulla a, fermentum eros. Nam vitae enim vitae mi lobortis auctor. </p>
            <p style="margin-block-start: 1rem;">Duis maximus tincidunt nunc vel vestibulum. Aliquam ut orci orci. 
            Duis maximus, augue at tincidunt efficitur, purus dui consequat risus, et sollicitudin dui sem sit amet est. Duis faucibus sapien in convallis scelerisque. 
            Fusce iaculis, justo viverra consectetur pretium, felis enim iaculis tortor, ut condimentum ligula sem et mi. </p>
            <p style="margin-block-start: 1rem;">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
            Nulla ut arcu risus. Aliquam velit turpis, aliquam sed blandit at, volutpat ac erat.</p>
          </main>
        `;
      }

      return html`
        <p>
          The 'Skip Links' component will scroll to the target element within this page.
        </p>
        <p style="margin-bottom: 100vh;">
          <a href="#">Click me and see it in action.</a>
        </p>
        ${story()}
      `;
    },
  ],
};
