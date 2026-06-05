import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import "../qgds-direction-link/qgds-direction-link.js";
import "./qgds-content-footer.styles.scss";

interface Args {
    content: string;
    linkLabel: string;
    linkHref: string;
}

const meta: Meta<Args> = {
  title: "Patterns/Content Footer",
  tags: ["autodocs"],
  args: {
    content: "<p><strong>Last updated:</strong> March 2026</p>",
    linkLabel: "Back to top",
    linkHref: "#top",
  },
  render: (args: Args) => html`
    <div class="qgds-content-footer">
      ${unsafeHTML(args.content)}
      <qgds-direction-link label=${args.linkLabel} href=${args.linkHref} direction="up"></qgds-direction-link>
    </div>
  `,
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

