import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import "./qgds-tabs";
import "./qgds-tabs-item";
import "../qgds-button/qgds-button";

import type { QGDSTabs } from "./qgds-tabs";
import { palettes } from "../../utils";
import { chromaticModes } from "../../../.storybook/modes";

const { args, argTypes, template } = getStorybookHelpers<QGDSTabs>("qgds-tabs");

argTypes.palette = {
  control: { type: "select" },
  options: Object.keys(palettes),
};

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Tabs",
  component: "qgds-tabs",
  subcomponents: {
    "Tabs Item": "qgds-tabs-item",
  },
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};
export default meta;

const ctaButton = html`<qgds-button
  href="https://qld.gov.au"
  label="Find out more"
  target="_blank"
  type="button"
  variant="primary"
  class="qgds-mt-16"
></qgds-button>`;

export const Default: Story = {
  args: meta.args,
  parameters: {
    ...chromaticModes,
  },
  render: (args) => html`
    <div class="qgds-content">
      <qgds-tabs palette=${args.palette}>
        <qgds-tabs-item label="Tab label 1" icon-name="home">
          <h2>Section Heading (H2)</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
          ${ctaButton}
        </qgds-tabs-item>
        <qgds-tabs-item label="Tab label 2" icon-name="design">
          <h2>Section Heading Item 2</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
        </qgds-tabs-item>
        <qgds-tabs-item label="Tab label 3" icon-name="settings">
          <h2>Section Heading Item 3</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
        </qgds-tabs-item>
        <qgds-tabs-item label="Tab label 4">
          <h2>Section Heading Item 4</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
        </qgds-tabs-item>
        <qgds-tabs-item label="Tab label 5">
          <h2>Section Heading Item 5</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
        </qgds-tabs-item>
        <qgds-tabs-item label="Tab label 6">
          <h2>Section Heading Item 6</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur. Viverra eu pulvinar a eu mauris ac at ultricies est. Tincidunt
            ultrices commodo vestibulum non netus. Mauris maecenas lacus hendrerit urna ultricies auctor. Sed tristique
            nascetur sapien condimentum adipiscing augue quisque eu. Facilisi ligula quam faucibus feugiat. Sapien at at
            eget malesuada senectus donec pellentesque pellentesque odio.
          </p>
        </qgds-tabs-item>
      </qgds-tabs>
    </div>
  `,
};
