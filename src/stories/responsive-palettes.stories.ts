import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

const meta: Meta = {
  title: "Core styles/Colour palettes/Responsive palettes",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const DefaultSoftBold: Story = {
  name: "Default, soft at md, bold at lg",
  render: () => html`
    <style>
      .responsive-palettes-demo {
        display: grid;
        gap: 1rem;
        padding-block: 2rem;
      }

      .responsive-palettes-demo__panel {
        border: 1px solid var(--qgds-color-border);
        padding: 1.5rem;
      }

      .responsive-palettes-demo__panel > * + * {
        margin-block-start: 1rem;
      }

      .responsive-palettes-demo__meta {
        color: var(--qgds-color-text-lighter);
        font-size: 0.875rem;
      }

      .responsive-palettes-demo__links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
      }

      .responsive-palettes-demo__critical {
        color: var(--qgds-fg-critical);
        font-weight: 700;
      }
    </style>

    <div class="qgds qgds-container responsive-palettes-demo">
      <section class="qgds-palette-default qgds-palette-soft:md qgds-palette-bold:lg responsive-palettes-demo__panel">
        <p class="responsive-palettes-demo__meta">Classes: qgds-palette-default qgds-palette-soft:md qgds-palette-bold:lg</p>
        <h2>Responsive palette region</h2>
        <p>
          This panel uses the default palette below the medium breakpoint, switches to soft from medium, then switches to
          bold from large.
        </p>
        <p class="responsive-palettes-demo__critical">Critical text follows the active palette.</p>
        <p class="responsive-palettes-demo__links">
          <a href="#">Example link</a>
          <a href="#">Visited colour token target</a>
        </p>
      </section>
    </div>
  `,
};

export const MutedDeep: Story = {
  name: "Muted, deep at lg",
  render: () => html`
    <style>
      .responsive-palettes-demo {
        display: grid;
        gap: 1rem;
        padding-block: 2rem;
      }

      .responsive-palettes-demo__panel {
        border: 1px solid var(--qgds-color-border);
        padding: 1.5rem;
      }

      .responsive-palettes-demo__panel > * + * {
        margin-block-start: 1rem;
      }

      .responsive-palettes-demo__meta {
        color: var(--qgds-color-text-lighter);
        font-size: 0.875rem;
      }

      .responsive-palettes-demo__critical {
        color: var(--qgds-fg-critical);
        font-weight: 700;
      }
    </style>

    <div class="qgds qgds-container responsive-palettes-demo">
      <section class="qgds-palette-muted qgds-palette-deep:lg responsive-palettes-demo__panel">
        <p class="responsive-palettes-demo__meta">Classes: qgds-palette-muted qgds-palette-deep:lg</p>
        <h2>Another responsive palette region</h2>
        <p>This panel starts muted and switches to deep from the large breakpoint.</p>
        <p class="responsive-palettes-demo__critical">Critical text follows the active palette.</p>
      </section>
    </div>
  `,
};
