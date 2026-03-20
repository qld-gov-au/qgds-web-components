import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import "./qgds-image.js";
import type { QGDSImage } from "./qgds-image.js";
import "../qgds-callout/qgds-callout.ts";

const { args, argTypes, template } = getStorybookHelpers<QGDSImage>("qgds-image");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/QGDS Image",
  component: "qgds-image",
  tags: ["autodocs"],
  args: {
    ...args,
    src: "./src/img/ds-example-image-3.jpg",
    alt: "Placeholder image",
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

export const Default: Story = {
  args: {
    aspect: "3:2",
  },
};

export const WithCaption: Story = {
  args: {
    caption: `Currumbin Beach, Queensland, Australia. Photo by <a href="https://unsplash.com/@joshwithers?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Josh Withers</a> on <a href="https://unsplash.com/photos/a-group-of-people-walking-down-a-road-at-sunset-6VB9fI0imgg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      `,
  },
};

export const WithRatios: Story = {
  render: (args: Args) => {
    // Define this based on your component's allowed values
    const horizontalRatios = ["16:9", "2:1", "3:2", "4:3", "1:1"] as const;
    const verticalRatios = ["2:3", "3:4", "9:16"] as const;

    return html`
      <style>
        .image-grid {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          align-items: baseline;
          margin-bottom: 2rem;
          width: fit-content;
        }
        qgds-image {
          /* CSS custom properties cascade into qgds-image shadow DOM */
          --image-border-radius: 5px;
          --figure-border: 1px solid grey;
          --figure-padding: 3px;
        }
      </style>

      <p>
        Ratios with qgds-image's with the :host <br />--image-border-radius: 5px; <br />--figure-border: 1px solid grey;
        <br />
        --figure-padding: 3px;
      </p>

      <div class="image-grid">
        ${horizontalRatios.map((ratio, i: number) => {
          return template({
            ...args,
            aspect: ratio,
            alt: `Ratio ${ratio}`,
            caption: `Aspect ratio: ${ratio}`,
            width: 200 + i * 10,
          });
        })}
      </div>

      <div class="image-grid">
        ${verticalRatios.map((ratio, i: number) => {
          return template({
            ...args,
            aspect: ratio,
            alt: `Ratio ${ratio}`,
            caption: `Aspect ratio: ${ratio}`,
            height: 240 + i * 10,
          });
        })}
      </div>
    `;
  },
};

export const WithHotspot: Story = {
  args: {
    hotspot: "90, 90",
    aspect: "9:16",
    caption: "Image with hotspot positioning (focal point: 90%, 90%)",
    width: 400,
  },
};

export const NaturalDimensions: Story = {
  name: "Natural Dimensions (No Aspect)",
  args: {
    caption: "Image using natural dimensions without aspect ratio constraint",
    width: 400,
  },
};

export const DecorativeImage: Story = {
  name: "Decorative Image",
  args: {
    src: "./src/img/photo-decorative.jpeg",
    decorative: true,
    aspect: "16:9",
  },
  render: (args: Args) => html`
    <div>
      <p>This decorative image has no alt text and is hidden from screen readers:</p>
      ${template(args)}
      <p>It's purely decorative and doesn't add meaning to the content.</p>
    </div>
  `,
};

export const WithAriaLabel: Story = {
  name: "With ARIA Label",
  args: {
    ariaLabel: "Queensland Government building exterior with native gardens",
    aspect: "16:9",
    caption: "Using aria-label for context-specific description",
  },
};

export const WithLongDescription: Story = {
  name: "With Long Description",
  render: (args: Args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <p>Complex images like charts need detailed descriptions for accessibility:</p>
      ${template({
        ...args,
        src: "./src/img/photo-graph.jpeg",
        alt: "Queensland population growth chart 2020-2025",
        aspect: "16:9",
        ariaDescribedby: "chart-description",
        caption: "Population growth by region",
      })}

      <qgds-callout heading="Detailed Description:" heading-level="h3">
        Bar chart showing population growth across Queensland regions from 2020 to 2025. Brisbane showed 12% growth,
        Gold Coast 8%, Sunshine Coast 10%, Townsville 5%, and Regional Queensland 3%.
      </qgds-callout>
    </div>
  `,
};

export const ResponsiveImage: Story = {
  name: "Responsive Image (srcset)",
  args: {
    srcset: "./src/img/ds-example-image-3.jpg 1x, ./src/img/ds-example-image-3.jpg 2x",
    sizes: "(max-width: 600px) 100vw, 600px",
    aspect: "3:2",
    caption: "Responsive image with srcset and sizes for different screen densities",
  },
};

export const PerformanceOptimized: Story = {
  name: "Performance Optimized",
  args: {
    fetchpriority: "high",
    decoding: "async",
    loading: "eager",
    aspect: "16:9",
    caption: "Hero image with fetchpriority='high' for LCP optimization",
  },
};

export const LazyLoading: Story = {
  name: "Lazy Loading",
  render: (args: Args) => html`
    <div style="display: flex; flex-direction: column; gap: 2rem;">
      <p>Scroll down to see lazy-loaded images below the fold:</p>
      <div
        style="height: 100vh; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #000; border-radius: 8px;"
      >
        <p>⬇️ Scroll down ⬇️</p>
      </div>
      ${[1, 2, 3].map(
        (i) => html`
          ${template({
            ...args,
            aspect: "16:9",
            loading: "lazy",
            src: `../src/img/ds-example-image-${i}.jpg`,
            caption: `Lazy-loaded image ${i}`,
          })}
        `
      )}
    </div>
  `,
};

export const WithAlignment: Story = {
  name: "With Alignment",
  render: (args: Args) => html`
    <div>
      <h3>Left Aligned</h3>
      <p>
        ${template({
          ...args,
          align: "left",
          aspect: "4:3",
          width: 300,
          caption: "Image aligned to the left",
        })}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>

      <h3 style="clear: both; margin-top: 2rem;">Right Aligned</h3>
      <p>
        ${template({
          ...args,
          src: "../src/img/ds-example-image-2.jpg",
          align: "right",
          aspect: "4:3",
          width: 300,
          caption: "Image aligned to the right",
        })}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat.
      </p>
    </div>
  `,
};

export const ComplexAccessibility: Story = {
  name: "Complex Accessibility Example",
  render: (args: Args) => html`
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h2>Accessible Complex Image Example</h2>
      <p>This example combines multiple accessibility features:</p>
      ${template({
        ...args,
        src: "./src/img/ds-example-image-2.jpg",
        alt: "Queensland regional connectivity infrastructure map",
        ariaLabel: "Interactive map showing fiber optic network coverage across Queensland regions",
        ariaDescribedby: "map-details",
        aspect: "16:9",
        loading: "eager",
        fetchpriority: "high",
        caption: `Queensland Digital Infrastructure Map 2025. <a href="#">View full report</a>`,
      })}

      <qgds-callout heading="Detailed Map Description:" heading-level="h3">
        <ul>
          <li>Blue lines represent fiber optic cables connecting major cities</li>
          <li>Green markers indicate 5G tower locations (328 total)</li>
          <li>Red zones show areas with infrastructure gaps requiring investment</li>
          <li>Yellow highlights represent planned developments for 2026-2027</li>
        </ul>
      </qgds-callout>
    </div>
  `,
};

export const WithReferrerPolicy: Story = {
  name: "With Referrer Policy",
  args: {
    referrerpolicy: "strict-origin-when-cross-origin",
    aspect: "3:2",
    caption: "Image with referrer policy for privacy (strict-origin-when-cross-origin)",
  },
};
