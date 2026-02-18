import type { Meta, StoryObj } from "@storybook/web-components";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import type { QGDSCard } from "./qgds-card";
import "./qgds-card";

const { args, argTypes, template } = getStorybookHelpers<QGDSCard>("qgds-card");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/QGDS Card",
  component: "qgds-card",
  tags: ["autodocs"],
  args,
  argTypes,
  render: (args) => template(args),
};
export default meta;

export const Default: Story = {
  args: {
    "heading": "Card title",
    "main-slot": "<p>This is a card description on the main slot.</p>",
  },
};

// export const Complex: Story = {
//   args: {
//     heading: "Before you start",
//     "heading-level": "h2",
//     "main": `
//         <p>
//           Please read the following information carefully <strong>before proceeding:</strong>
//         </p>
//         <ul>
//           <li>Ensure you have all necessary materials.</li>
//           <li>Follow the instructions step by step.</li>
//           <li>Contact support if you encounter any issues.</li>
//         </ul>
//       `,
//   },
// };
