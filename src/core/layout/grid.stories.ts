import type { StoryObj, Meta } from "@storybook/web-components-vite";
import { html } from "lit";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
import { classMap } from "lit/directives/class-map.js";

type OneToTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface Args {
  ["Item count"]: number;
  ["Item span"]: OneToTwelve;
  ["Column count"]: OneToTwelve;
  ["Gutter width"]: "32px";
}

const meta: Meta<Args> = {
  title: "Core styles/Layout/Grid",
  component: "grid",
  args: {
    "Item count": 1,
    "Item span": 1,
    "Column count": 4,
    // "Column count xs": 4,
    // "Column count sm": 4,
    // "Column count md": 4,
    // "Column count lg": 4,
    // "Column count xl": 4,
    // "Column count xxl": 4,
    "Gutter width": "32px",
  },
  render: (args) => {
    return html`<div class="qgds-cols">
      ${map(
        range(args["Item count"]),
        (i) => html`<div class=${classMap({ "qgds-span-2": args["Item span"] > 1 })}>Item ${i + 1}</div>`
      )}
    </div>`;
  },
};

export default meta;

export const Primary: StoryObj = {};
