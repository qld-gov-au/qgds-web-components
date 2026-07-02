import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";

import "./qgds-pagination";
import type { QGDSPagination } from "./qgds-pagination";

const { args, argTypes } = getStorybookHelpers<QGDSPagination>("qgds-pagination");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Pagination",
  component: "qgds-pagination",
  args: {
    ...args,
    "current-page": 3,
    "total-pages": 14,
    "prev-label": "Back",
    "next-label": "Next",
    "show-prev-next": "default",
    "link-base": "/page/",
    "aria-label": "Pagination navigation",
    // "page-range": 5,
    // "show-more": true,
    // "show-first": true,
    // "show-last": true,
    // "show-prev-next": true,
    // "show-page-numbers": true,
  },

  argTypes: {
    ...argTypes,
    "show-prev-next": {
      control: { type: "radio" },
      options: ["default", "always"],
    },
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
        id="my-app-pager"
        current-page="${args["current-page"]}"
        total-pages="${args["total-pages"]}"
        prev-label="${args["prev-label"]}"
        next-label="${args["next-label"]}"
        show-prev-next="${args["show-prev-next"]}"
        link-base="${args["link-base"]}"
      >
      </qgds-pagination>
    `;
  },

  play: ({ canvasElement }) => {
    // Storybook demo only.
    // Play executes when the story renders, or a control changes. We use this hook to:
    // 1. attach an event listener,
    // 2. listen for any dispatched "qgds-navigate" events,
    // 3. and log the event payload to the Actions panel

    // Other clients would use their own methods to listen for "qgds-navigate", and react to the event as needed.
    // thing.addEventListener("qgds-navigate", doSomething());}

    const logSelection = action("qgds-navigate");
    const pagination = canvasElement.querySelector<QGDSPagination>("qgds-pagination");

    pagination?.addEventListener("qgds-navigate", (e) => {
      const event = e as CustomEvent<{
        action: "prev" | "next" | "page";
        requestedPage: number | null;
      }>;

      event.preventDefault();

      const { action, requestedPage } = event.detail;
      const currentPage = Number(pagination.currentPage);

      if (action === "prev") {
        pagination.currentPage = Math.max(1, currentPage - 1);
      } else if (action === "next") {
        pagination.currentPage = currentPage + 1;
      } else if (typeof requestedPage === "number") {
        pagination.currentPage = requestedPage;
      }

      pagination.blur();
      logSelection(event.detail);
    });
  },
};
export default meta;

/* Default story with all controls set to non-default values to show the component's capabilities. */
export const Default: Story = {};

/* Middle page to demonstrate mutliple more ellipses */
export const MiddleRange: Story = {
  args: {
    "current-page": 6,
    "total-pages": 14,
  },
};

/* Middle page to demonstrate mutliple more ellipses */
export const EndRange: Story = {
  args: {
    "current-page": 13,
    "total-pages": 14,
  },
};

/* Middle page to demonstrate mutliple more ellipses */
export const NarrowContainers: Story = {
  args: {
    "current-page": 2,
    "total-pages": 14,
  },
  decorators: [
    (Story) => html`
      <div style="width: 360px; margin-bottom: 2rem;">${Story()}</div>
      <div style="width: 480px; margin-bottom: 2rem;">${Story()}</div>
      <div style="width: 950px; margin-bottom: 2rem;">${Story()}</div>
    `,
  ],
};

/* Middle page to demonstrate mutliple more ellipses */
export const HighPageCount: Story = {
  args: {
    "current-page": 100,
    "total-pages": 124,
  },
};
