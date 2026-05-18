import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";

import "../components/qgds-card/qgds-card";

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
    <div
      class="qgds qgds-container responsive-palettes-demo qgds-palette-soft:md qgds-palette-bold:lg"
      style="padding-block: 2rem;"
    >
      <qgds-card target="_blank" heading="QGDS Card" action="multiple">
        This qgds-card does not use its own palette attribute. It responds to the palette context of its parent
        container.
        <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
        <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
        <qgds-link slot="footer-links" href="#" icon-name="arrow-right" icon-size="md" label="Label"></qgds-link>
      </qgds-card>
    </div>

    <div class="qgds qgds-container qgds-mt-24">
      <h2 class="qgds-mb-16">Responsive palette classes</h2>
      <p>
        Add a responsive palette class to a container to change its palette context at specific breakpoints. Once
        applied, the palette takes effect from that breakpoint upward. The example above includes the following classes:
      </p>
      <p>
        <code><pre>qgds-palette-soft:md</pre></code>
        <code><pre>qgds-palette-bold:lg</pre></code>
      </p>
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
