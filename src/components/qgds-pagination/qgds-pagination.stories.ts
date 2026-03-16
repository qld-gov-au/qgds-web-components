import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";

import "./qgds-pagination";
import type { QGDSPagination } from "./qgds-pagination";

const { args, argTypes } =
  getStorybookHelpers<QGDSPagination>("qgds-pagination");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/QGDS Pagination",
  component: "qgds-pagination",
  args: {
    ...args,
    "current-page": 3,
    "total-pages": 14,
    "prev-label": "Back",
    "next-label": "Next",
    "link-base": "/page/",
    "aria-label": "Pagination navigation",
    "no-reload": false,
    // "page-range": 5,
    // "show-more": true,
    // "show-first": true,
    // "show-last": true,
    // "show-prev-next": true,
    // "show-page-numbers": true,
  },

  argTypes: {
    ...argTypes,
    // "show-prev-next": { control: "boolean" },
    // "show-page-numbers": { control: "boolean" },
    // "show-more": { control: "boolean" },
    // ...other boolean attributes
  },

  tags: ["autodocs"],

  //Render a custom template here, Do not use the template helper from storybook-helpers, as we need to wrap the component in a div to show the pagination's justify-content CSS property in action
  render: (args) => {
    // let booleansArgs = [
    //   args["show-prev-next"] ? "show-prev-next" : "",
    //   args["show-page-numbers"] ? "show-page-numbers" : "",
    //   args["show-more"] ? "show-more" : "",
    //   args["show-first"] ? "show-first" : "",
    //   args["show-last"] ? "show-last" : "",
    // ]
    //   .filter(Boolean)
    //   .join(" ");

    return html`
      <qgds-pagination
        current-page="${args["current-page"]}"
        total-pages="${args["total-pages"]}"
        page-range="${args["page-range"]}"
        prev-label="${args["prev-label"]}"
        next-label="${args["next-label"]}"
        link-base="${args["link-base"]}"
        ?no-reload="${args["no-reload"]}"
        ?show-more="${args["show-more"]}">
      </qgds-pagination>
    `;
  },

  decorators: [
    (Story) => html`
      <script>
        document.addEventListener("qgds-navigate", (e) => {
          const eventNode =
            e.localName || e.target?.localName || "unknown element";

          if (eventNode.toString() === "qgds-pagination") {
            let newPage = e.detail.pageid;

            if (newPage === "prev") {
              newPage = Number(e.target.currentPage) - 1;
            }

            if (newPage === "next") {
              newPage = Number(e.target.currentPage) + 1;
            }

            e.target.currentPage = newPage; // Update the pagination's current page based on the event detail
            e.target.blur();
          }
        });
      </script>

      ${Story()}
    `,
  ],

  play: ({ canvasElement }) => {
    // Storybook demo only.
    // Play executes when the story renders, or a control changes. We use this hook to:
    // 1. attach an event listener,
    // 2. listen for any dispatched "qgds-navigate" events,
    // 3. and log the event payload to the Actions panel

    // Other clients would use their own methods to listen for "qgds-navigate", and react to the event as needed.
    // thing.addEventListener("qgds-navigate", doSomething());}

    const logSelection = action("qgds-navigate");
    const details = canvasElement.querySelector("qgds-pagination");

    details?.addEventListener("qgds-navigate", (e) => {
      logSelection((e as CustomEvent).detail);
    });
  },
};
export default meta;

/* Default story with all controls set to non-default values to show the component's capabilities. */
export const Default: Story = {};

/* Middle page to demonstrate mutliple more ellipses */
export const MiddlePage: Story = {
  args: {
    "current-page": 4,
    "total-pages": 8,
  },
};
