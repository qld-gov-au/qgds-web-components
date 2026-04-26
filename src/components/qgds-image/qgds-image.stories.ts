import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";

import "./qgds-image.js";
import type { QGDSImage } from "./qgds-image.js";

const { args, argTypes, template } = getStorybookHelpers<QGDSImage>("qgds-image");

type Args = typeof args;
type Story = StoryObj<Args>;

const meta: Meta<Args> = {
  title: "Components/Image",
  component: "qgds-image",
  tags: ["autodocs"],
  args: {
    ...args,
    src: "https://picsum.photos/seed/qgds-beach/600/400",
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
        qgds-image {
          max-width: 600px;
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
    caption: `Currumbin Beach, Queensland, Australia. Photo by <a href="#">Josh Withers</a> on <a href="#">Unsplash</a>
      `,
  },
};

export const WithRatios: Story = {
  decorators: [
    (story) => {
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
        </style>

        ${story()}
      `;
    },
  ],
  render: (args: Args) => {
    // Define this based on your component's allowed values
    const horizontalRatios = ["16:9", "2:1", "3:2", "4:3", "1:1"] as const;
    const verticalRatios = ["2:3", "3:4", "9:16"] as const;

    return html`
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
    src: "https://fastly.picsum.photos/id/56/2880/1920.jpg?hmac=BIplhYgNZ9bsjPXYhD0xx6M1yPgmg4HtthKkCeJp6Fk",
    width: 600,
    decorative: true,
    aspect: "16:9",
  },
  decorators: [
    (story) => {
      return html`
        <div>
          ${story()}
          <p>This decorative image has no alt text and is hidden from screen readers:</p>
          <p>It's purely decorative and doesn't add meaning to the content.</p>
        </div>
      `;
    },
  ],
  render: (args: Args) => html` ${template(args)} `,
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
  decorators: [
    (story) => {
      return html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <p>Complex images like charts need detailed descriptions for accessibility:</p>
          ${story()}
          <qgds-callout heading="Detailed Description:" heading-level="h3">
            Bar chart showing population growth across Queensland regions from 2020 to 2025. Brisbane showed 12% growth,
            Gold Coast 8%, Sunshine Coast 10%, Townsville 5%, and Regional Queensland 3%.
          </qgds-callout>
        </div>
      `;
    },
  ],
  render: (args: Args) => html`
    ${template({
      ...args,
      src: "https://quickchart.io/chart?width=600&height=338&devicePixelRatio=1&c={type:'bar',data:{labels:['Brisbane','Gold Coast','Sunshine Coast','Townsville','Regional QLD'],datasets:[{label:'2020',data:[2500,700,350,180,950]},{label:'2025',data:[2800,756,385,189,978]}]}}",
      alt: "Queensland population growth chart 2020-2025",
      aspect: "16:9",
      ariaDescribedby: "chart-description",
      caption: "Population growth by region",
    })}
  `,
};

export const ResponsiveImage: Story = {
  name: "Responsive Image (srcset)",
  args: {
    srcset: "https://picsum.photos/seed/qgds-beach/600/400 1x, https://picsum.photos/seed/qgds-beach/1200/800 2x",
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
  decorators: [
    (story) => {
      return html`
        <div style="display: flex; flex-direction: column; gap: 2rem;">
          <p>Scroll down to see lazy-loaded images below the fold:</p>
          <div
            style="height: 100vh; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #000; border-radius: 8px;"
          >
            <p>⬇️ Scroll down ⬇️</p>
          </div>
          ${story()}
        </div>
      `;
    },
  ],
  render: (args: Args) =>
    html` ${[1, 2, 3].map(
      (i) => html`
        ${template({
          ...args,
          aspect: "16:9",
          loading: "lazy",
          src: `https://picsum.photos/seed/qgds-lazy-${i}/600/338`,
          caption: `Lazy-loaded image ${i}`,
        })}
      `
    )}`,
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
          src: "https://picsum.photos/seed/qgds-right/600/450",
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
  decorators: [
    (story) => {
      return html`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <h2>Accessible Complex Image Example</h2>
          <p>This example combines multiple accessibility features:</p>
          ${story()}
          <qgds-callout heading="Detailed Image Description:" heading-level="h3">
            <ul>
              <li>Wide golden sandy beach stretching along the coastline with beachgoers visible</li>
              <li>Modern high-rise buildings and resorts lining the beachfront creating a distinctive skyline</li>
              <li>Turquoise Pacific Ocean waters with white foam from breaking waves</li>
              <li>Green headlands and coastal vegetation visible in the distance</li>
            </ul>
          </qgds-callout>
        </div>
      `;
    },
  ],
  render: (args: Args) =>
    html` ${template({
      ...args,
      src: "https://www.ottsworld.com/wp-content/uploads/2014/06/GoldCoastBeach-3.jpg",
      alt: "Gold Coast beachfront with high-rise buildings and sandy beach",
      ariaLabel:
        "Aerial photograph of Gold Coast showing pristine beach, turquoise ocean, and coastal high-rise developments",
      ariaDescribedby: "map-details",
      aspect: "16:9",
      loading: "eager",
      fetchpriority: "high",
      caption: `Gold Coast Beach, Queensland 2025. <a href="#">View high resolution</a>`,
    })}`,
};

export const WithReferrerPolicy: Story = {
  name: "With Referrer Policy",
  args: {
    referrerpolicy: "strict-origin-when-cross-origin",
    aspect: "3:2",
    caption: "Image with referrer policy for privacy (strict-origin-when-cross-origin)",
  },
};
