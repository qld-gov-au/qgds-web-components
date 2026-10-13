import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const spacingValues = ["0", "2", "4", "6", "8", "12", "16", "24"] as const;
const marginUtilities = ["m", "mx", "my", "mt", "mb", "ml", "mr"] as const;
const paddingUtilities = ["p", "px", "py", "pt", "pb", "ps", "pe"] as const;

const meta = {
  title: "Core Styles/Layout/Utility Classes",
  component: "qgds-utilities",
  parameters: {
    docs: {
      description: {
        component: `
Spacing utilities are available within the .qgds namespace and follow a mobile-first pattern.

## Naming pattern

- Base: qgds-{utility}-{value}
- Responsive: qgds-{utility}-{value}:{breakpoint}

Examples:

- qgds-px-0
- qgds-px-16:md
- qgds-my-24:lg
- qgds-mx-n16:sm

## Breakpoints

- xs
- sm
- md
- lg
- xl
- xxl

## Margin utilities

${marginUtilities.map((utility) => `- ${utility}`).join("\n")}

Margin values: ${spacingValues.join(", ")} and negative values n2, n4, n6, n8, n12, n16, n24.

## Padding utilities

${paddingUtilities.map((utility) => `- ${utility}`).join("\n")}

Padding values: ${spacingValues.join(", ")}.
`,
      },
    },
  },
  decorators: [
    (story) =>
      html`<style>
          .utility-demo-grid {
            display: grid;
            gap: 0.75rem;
          }

          @media (min-width: 700px) {
            .utility-demo-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          .utility-demo-box {
            background: #e7f2ff;
            border: 1px solid #9ec5ff;
            color: #003c78;
            border-radius: 0.25rem;
          }

          .utility-demo-inner {
            background: #ffffff;
            border: 1px dashed #69a3f0;
            color: #003c78;
          }

          .utility-demo-note {
            margin-block-start: 0.75rem;
            font-size: 0.875rem;
            color: #2d3b4f;
          }
        </style>
        ${story()}`,
  ],
  render: () => html`
    <section class="qgds">
      <div class="qgds-container">
        <h3>Spacing utility examples</h3>
        <p class="utility-demo-note qgds-mb-32">
          Utilities are scoped to the qgds namespace root. Wrap usage in a .qgds container.
        </p>

        <div class="qgds-cols">
          <div class="qgds-span-12 utility-demo-box qgds-p-8 qgds-mt-16 qgds-mt-0:md">
            <div class="utility-demo-inner qgds-p-8">qgds-mt-16 qgds-mt-0:md</div>
          </div>

          <div class="qgds-span-12 utility-demo-box qgds-p-8 qgds-ps-48:lg">
            <div class="utility-demo-inner qgds-p-8">qgds-p-8 qgds-ps-48:lg</div>
          </div>

          <div class="qgds-span-12 utility-demo-box qgds-p-8 qgds-mx-n32:lg">
            <div class="utility-demo-inner qgds-p-8">qgds-mx-n32:lg (negative margin)</div>
          </div>

          <div class="qgds-span-12 utility-demo-box qgds-p-8 qgds-px-48:lg">
            <div class="utility-demo-inner qgds-p-8">qgds-px-48:lg</div>
          </div>
        </div>
      </div>
    </section>
  `,
} satisfies Meta;

export default meta;

export const Overview: StoryObj = {};
