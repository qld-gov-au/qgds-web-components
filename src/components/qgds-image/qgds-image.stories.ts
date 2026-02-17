import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import "./qgds-image";
import type { QGDSImage } from "./qgds-image";

const { args, argTypes, template } =
  getStorybookHelpers<QGDSImage>("qgds-image");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/QGDS Image",
  component: "qgds-image",
  tags: ["autodocs"],
  args: {
    ...args,
    src: "./src/assets/images/example.jpg",
    alt: "Placeholder image",
    aspect: "3:2",
  },
  argTypes,
  decorators: [
    (Story) => html`
      <style>
        .story-wrapper {
          max-width: 600px;
          margin: 2rem;
        }
      </style>
      <div class="story-wrapper">${Story()}</div>
    `,
  ],
  render: (args) => template(args),
};

export default meta;

export const Default: Story = {};

export const WithCaption: Story = {
  args: {
    caption: `Currumbin Beach, Queensland, Australia. Photo by <a href="https://unsplash.com/@joshwithers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Josh Withers</a> on <a href="https://unsplash.com/photos/a-group-of-people-walking-down-a-road-at-sunset-6VB9fI0imgg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      `,
  },
};

export const WithRatios: Story = {
  render: (args) => {
    // Define this based on your component's allowed values
    const horizontalRatios = ["16:9", "2:1", "3:2", "4:3", "1:1"];
    const verticalRatios = ["2:3", "3:4", "9:16"];

    return html`
      <style>
        .image-grid {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          align-items: baseline;
          margin-bottom: 2rem;
        }
        .image-wrap {
          width: 200px;
          height: 200px;
        }
      </style>

      <div class="image-grid">
        ${horizontalRatios.map((ratio: string, i: number) => {
          return template({
            ...args,
            aspect: ratio,
            alt: `Ratio ${ratio}`,
            caption: `Aspect ratio: ${ratio}`,
            width: `${200 + i * 10}`,
          });
        })}
      </div>

      <div class="image-grid">
        ${verticalRatios.map((ratio: string, i: number) => {
          return template({
            ...args,
            aspect: ratio,
            alt: `Ratio ${ratio}`,
            caption: `Aspect ratio: ${ratio}`,
            height: `${240 + i * 10}`,
          });
        })}
      </div>
    `;
  },
};
