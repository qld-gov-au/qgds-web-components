import type { Decorator, StoryObj } from "@storybook/web-components";
import { html, type TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";

import { getStorybookHelpers } from "@wc-toolkit/storybook-helpers";
import { action } from "storybook/actions";
import { chromaticModes } from "../../../../.storybook/modes";
import { withEventActions } from "../../../../.storybook/storybook-helpers";
import type { QGDSHeader } from "../qgds-header";
import type { QGDSAttributionBar } from "../../qgds-attribution-bar/qgds-attribution-bar";
import type { QGDSNavigation } from "../../qgds-navigation/qgds-navigation";
import "../qgds-header";
import "../../qgds-attribution-bar/qgds-attribution-bar";
import "../../qgds-link/qgds-link";
import "../../qgds-logo/qgds-logo";
import "../../qgds-search-input/qgds-search-input";
import "../../qgds-navigation/qgds-navigation";

import coBrandLogo from "../../qgds-logo/assets/breast-screen-qld-logo.svg";
import standAloneLogoOho from "../../qgds-logo/assets/office-health-ombudsman-logo.svg";
import standAloneLogoCcc from "../../qgds-logo/assets/ccc-logo.svg";

const { args: defaultArgs } = getStorybookHelpers<QGDSHeader>("qgds-header");
const { args: navigationArgs, template: navigationTemplate } = getStorybookHelpers<QGDSNavigation>("qgds-navigation");
const { args: attributionArgs, template: attributionTemplate } =
  getStorybookHelpers<QGDSAttributionBar>("qgds-attribution-bar");

type HeaderArgs = typeof defaultArgs;
type HeaderStory = StoryObj<HeaderArgs>;

interface HeaderContentOptions {
  attribution: keyof typeof attributionSites;
  brandLogo?: string;
  includeCoatOfArms?: boolean;
  navigationId?: string;
}

interface StoryDescription {
  brands: string;
  summary: string;
  settings?: readonly string[];
  styles?: TemplateResult;
}

interface BrandStoryOptions {
  args?: Partial<HeaderArgs>;
  content: HeaderContentOptions;
  description: StoryDescription;
  parameters?: HeaderStory["parameters"];
}

const attributionSites = {
  qld: {
    url: "https://www.qld.gov.au",
    label: "qld.gov.au",
  },
  oho: {
    url: "https://oho.qld.gov.au",
    label: "oho.qld.gov.au",
  },
  ccc: {
    url: "https://www.ccc.qld.gov.au",
    label: "ccc.qld.gov.au",
  },
} as const;

const omitDefault = <T>(value: T, defaultValue: T): T | undefined => (value === defaultValue ? undefined : value);

const formatBooleanAttributes = (source: string): string =>
  source.replace(/\s(hide-coa-logo|hide-mobile-bottom-row)=(?:""|'')/g, " $1");

const logSearchToggle = action("qgds-toggle-search-mobile");
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const onSearchToggle = () => logSearchToggle();

const navigationItems = html`
  <qgds-navigation-item label="Home" href="#" icon-name="home" only-icon is-current></qgds-navigation-item>
  <qgds-navigation-item label="Services" href="#services"></qgds-navigation-item>
  <qgds-navigation-item label="About" href="#about"></qgds-navigation-item>
  <qgds-navigation-item label="Contact us" href="#contact" slot="mobile-cta" icon-name="phone"></qgds-navigation-item>
`;

const attributionLinks = html`
  <qgds-link icon-name="phone" href="https://www.qld.gov.au/contact-us" label="Contact us"></qgds-link>
`;

const eventActionDecorators = [
  withEventActions([
    "qgds-navigation-open",
    "qgds-navigation-opened",
    "qgds-navigation-close",
    "qgds-navigation-closed",
  ]),
];

const withStoryStyles: Decorator = (story) => html`
  <style>
    .story-heading {
      margin-block-end: 2rem;
    }

    .story-heading strong {
      font-size: 1.25rem;
      font-weight: var(--qgds-font-weight-bold, 700);
    }

    .story-settings {
      font-size: 0.875rem;
      margin-block-start: 2rem;
      margin-inline-start: 0.5rem;
    }

    .story-settings h4 {
      font-size: 1rem;
      margin-block-end: 0.5rem;
    }

    .story-settings ul {
      margin-block-start: 0.25rem;
      margin-inline-start: 1rem;
    }
  </style>
  ${story()}
`;

const withBrandVariationStyles: Decorator = (story) => html`
  <style>
    .brand-variations {
      display: grid;
      gap: 2rem;
    }

    .brand-variation + .brand-variation {
      border-block-start: 1px solid #eee;
      padding-block-start: 2rem;
    }

    .brand-variation h3 {
      margin-block-end: 1rem;
    }
  </style>
  ${story()}
`;

const renderBrandLogo = (customLogo: string, args: HeaderArgs) => html`
  <qgds-logo
    slot="brand-logo"
    logo=""
    custom-logo=${customLogo}
    custom-logo-alt=${ifDefined(omitDefault(args["site-name"], defaultArgs["site-name"]))}
  ></qgds-logo>
`;

const renderHeader = (args: HeaderArgs, options: HeaderContentOptions) => {
  const attribution = attributionSites[options.attribution];

  return html`
    <qgds-header
      palette=${ifDefined(omitDefault(args.palette, defaultArgs.palette))}
      site-name=${ifDefined(omitDefault(args["site-name"], defaultArgs["site-name"]))}
      site-url=${ifDefined(omitDefault(args["site-url"], defaultArgs["site-url"]))}
      mobile-top-content=${ifDefined(omitDefault(args["mobile-top-content"], defaultArgs["mobile-top-content"]))}
      ?hide-coa-logo=${args["hide-coa-logo"]}
      ?hide-mobile-bottom-row=${args["hide-mobile-bottom-row"]}
      @qgds-toggle-search-mobile=${onSearchToggle}
    >
      ${attributionTemplate(
        {
          ...attributionArgs,
          slot: "pre-header",
          palette: "bold",
          ...attribution,
        },
        attributionLinks
      )}
      ${options.includeCoatOfArms
        ? html`<qgds-logo slot="logo" logo="coa-stacked" alt="Queensland Government"></qgds-logo>`
        : undefined}
      ${options.brandLogo ? renderBrandLogo(options.brandLogo, args) : undefined}
      <qgds-search-input slot="search"></qgds-search-input>
      ${navigationTemplate(
        {
          ...navigationArgs,
          slot: "navigation",
          id: options.navigationId ?? "mynav",
        },
        navigationItems
      )}
    </qgds-header>
  `;
};

const renderStorySettings = (settings: readonly string[]) => html`
  <div class="story-settings">
    <h4>Attributes</h4>
    <p>These are the Header attributes used:</p>
    <ul>
      ${settings.map((setting) => html`<li><code>${setting}</code></li>`)}
    </ul>
  </div>
`;

const withDescription =
  (description: StoryDescription): Decorator =>
  (story) => html`
    ${description.styles}
    <div class="story-heading">
      <p><strong>${description.brands}</strong></p>
      <p>${description.summary}</p>
    </div>
    ${story()} ${description.settings ? renderStorySettings(description.settings) : undefined}
  `;

const createBrandStory = ({ args = {}, content, description, parameters }: BrandStoryOptions): HeaderStory => ({
  args: {
    ...defaultArgs,
    ...args,
  },
  render: (storyArgs) => renderHeader(storyArgs, content),
  decorators: [...eventActionDecorators, withStoryStyles, withDescription(description)],
  parameters,
});

type BrandLogoMobileTopContent = "brand-logo" | "preheader-url" | "site-name";

const createBrandLogoAndSiteNameStory = (
  mobileTopContent: BrandLogoMobileTopContent,
  hideMobileBottomRow = false,
  showSettings = true
): HeaderStory =>
  createBrandStory({
    args: {
      "hide-coa-logo": true,
      "mobile-top-content": mobileTopContent,
      "hide-mobile-bottom-row": hideMobileBottomRow,
      "site-name": "Office of the Health Ombudsman",
    },
    content: {
      attribution: "oho",
      brandLogo: standAloneLogoOho,
    },
    description: {
      brands: "Endorsed and Standalone",
      summary: "Brand Logo and Site Name - No Coat of Arms",
      settings: showSettings
        ? [
            "hide-coa-logo",
            `mobile-top-content="${mobileTopContent}"`,
            ...(hideMobileBottomRow ? ["hide-mobile-bottom-row"] : []),
            'site-name="Office of the Health Ombudsman"',
          ]
        : undefined,
    },
  });

export const headerBrandParameters = {
  controls: {
    exclude: ["search-open"],
  },
  docs: {
    source: {
      transform: formatBooleanAttributes,
    },
  },
};

export const CoatOfArms = createBrandStory({
  content: {
    attribution: "qld",
  },
  description: {
    brands: "Master brand",
    summary: "This style only for qld.gov.au",
  },
  parameters: chromaticModes,
});

export const CoatOfArmsAndSiteName = createBrandStory({
  args: {
    "site-name": "Site name",
  },
  content: {
    attribution: "qld",
    includeCoatOfArms: true,
  },
  description: {
    brands: "Master brand, Sub-Brand, Co-Brand, and Endorsed",
    summary: "Coat of Arms and Site Name",
  },
});

export const CoatOfArmsAndBrandLogo = createBrandStory({
  content: {
    attribution: "qld",
    brandLogo: coBrandLogo,
    includeCoatOfArms: true,
  },
  description: {
    brands: "Co-Brand and Endorsed",
    summary: "Coat of Arms and Brand Logo",
    styles: html`
      <style>
        qgds-logo {
          @media (min-width: 992px) {
            --qgds-color-crest-fill: #000;
          }
        }
      </style>
    `,
  },
});

export const BrandLogoAndSiteNameTwoRowsSiteNameTop = createBrandLogoAndSiteNameStory("site-name");

export const BrandLogoAndSiteNameDesktop = createBrandLogoAndSiteNameStory("site-name", false, false);

export const BrandLogoAndSiteNameTwoRowsBrandLogoTop = createBrandLogoAndSiteNameStory("brand-logo");

export const BrandLogoAndSiteNameOneRowSiteNameTop = createBrandLogoAndSiteNameStory("site-name", true);

export const BrandLogoAndSiteNameOneRowBrandLogoTop = createBrandLogoAndSiteNameStory("brand-logo", true);

export const BrandLogoAndSiteNameOneRowSiteUrlTop = createBrandLogoAndSiteNameStory("preheader-url", true);

const brandLogoAndSiteNameMobileVariations = [
  {
    label: "Two mobile rows",
    mobileTopContent: "site-name",
    hideMobileBottomRow: false,
    settings: ["hide-coa-logo", 'mobile-top-content="site-name"'],
  },
  {
    label: "Two mobile rows",
    mobileTopContent: "brand-logo",
    hideMobileBottomRow: false,
    settings: ["hide-coa-logo", 'mobile-top-content="brand-logo"'],
  },
  {
    label: "One mobile row - Site name",
    mobileTopContent: "site-name",
    hideMobileBottomRow: true,
    settings: ["hide-coa-logo", 'mobile-top-content="site-name"', "hide-mobile-bottom-row"],
  },
  {
    label: "One mobile row - Brand logo",
    mobileTopContent: "brand-logo",
    hideMobileBottomRow: true,
    settings: ["hide-coa-logo", 'mobile-top-content="brand-logo"', "hide-mobile-bottom-row"],
  },
  {
    label: "One mobile row - Site URL",
    mobileTopContent: "preheader-url",
    hideMobileBottomRow: true,
    settings: ["hide-coa-logo", 'mobile-top-content="preheader-url"', "hide-mobile-bottom-row"],
  },
] as const;

export const BrandLogoAndSiteName: HeaderStory = {
  args: defaultArgs,
  render: () => html`
    <div class="brand-variations">
      ${brandLogoAndSiteNameMobileVariations.map(
        (variation, index) => html`
          <section class="brand-variation">
            <h3>${variation.label}</h3>
            ${renderHeader(
              {
                ...defaultArgs,
                "hide-coa-logo": true,
                "mobile-top-content": variation.mobileTopContent,
                "hide-mobile-bottom-row": variation.hideMobileBottomRow,
                "site-name": "Office of the Health Ombudsman",
              },
              {
                attribution: "oho",
                brandLogo: standAloneLogoOho,
                navigationId: `brand-logo-site-name-navigation-${index + 1}`,
              }
            )}
            ${renderStorySettings([...variation.settings, 'site-name="Office of the Health Ombudsman"'])}
          </section>
        `
      )}
    </div>
  `,
  decorators: [...eventActionDecorators, withStoryStyles, withBrandVariationStyles],
  parameters: {
    controls: {
      disable: true,
    },
  },
};

/**
 * Brand logo only Stories
 */

type BrandLogoOnlyMobileTopContent = Exclude<BrandLogoMobileTopContent, "site-name">;

const createBrandLogoOnlyStory = (
  mobileTopContent: BrandLogoOnlyMobileTopContent,
  hideMobileBottomRow = false,
  showSettings = true
): HeaderStory =>
  createBrandStory({
    args: {
      "hide-coa-logo": true,
      "mobile-top-content": mobileTopContent,
      "hide-mobile-bottom-row": hideMobileBottomRow,
    },
    content: {
      attribution: "ccc",
      brandLogo: standAloneLogoCcc,
    },
    description: {
      brands: "Endorsed and Standalone",
      summary: "Brand Logo Only - No Coat of Arms",
      settings: showSettings
        ? [
            "hide-coa-logo",
            `mobile-top-content="${mobileTopContent}"`,
            ...(hideMobileBottomRow ? ["hide-mobile-bottom-row"] : []),
          ]
        : undefined,
    },
  });

export const BrandLogoOnlyDesktop = createBrandLogoOnlyStory("brand-logo", false, false);

const brandLogoOnlyMobileVariations = [
  {
    label: "Two mobile rows",
    mobileTopContent: "preheader-url",
    hideMobileBottomRow: false,
    settings: ["hide-coa-logo", 'mobile-top-content="preheader-url"'],
  },
  {
    label: "One mobile row - Brand logo",
    mobileTopContent: "brand-logo",
    hideMobileBottomRow: true,
    settings: ["hide-coa-logo", 'mobile-top-content="brand-logo"', "hide-mobile-bottom-row"],
  },
  {
    label: "One mobile row - Site URL",
    mobileTopContent: "preheader-url",
    hideMobileBottomRow: true,
    settings: ["hide-coa-logo", 'mobile-top-content="preheader-url"', "hide-mobile-bottom-row"],
  },
] as const;

export const BrandLogoOnlyMobile: HeaderStory = {
  args: defaultArgs,
  render: () => html`
    <div class="brand-variations">
      ${brandLogoOnlyMobileVariations.map(
        (variation, index) => html`
          <section class="brand-variation">
            <h3>${variation.label}</h3>
            ${renderHeader(
              {
                ...defaultArgs,
                "hide-coa-logo": true,
                "mobile-top-content": variation.mobileTopContent,
                "hide-mobile-bottom-row": variation.hideMobileBottomRow,
              },
              {
                attribution: "ccc",
                brandLogo: standAloneLogoCcc,
                navigationId: `brand-logo-only-navigation-${index + 1}`,
              }
            )}
            ${renderStorySettings(variation.settings)}
          </section>
        `
      )}
    </div>
  `,
  decorators: [...eventActionDecorators, withStoryStyles, withBrandVariationStyles],
  parameters: {
    controls: {
      disable: true,
    },
  },
};

/**
 * Site name only Stories
 */

const siteNameOnly = "Office of the Health Ombudsman";

const siteNameOnlyMobileVariations = [
  {
    label: "Two mobile rows",
    mobileTopContent: "preheader-url",
    hideMobileBottomRow: false,
  },
  {
    label: "One mobile row - Site name",
    mobileTopContent: "site-name",
    hideMobileBottomRow: true,
  },
  {
    label: "One mobile row - Site URL",
    mobileTopContent: "preheader-url",
    hideMobileBottomRow: true,
  },
] as const;

export const SiteNameOnlyDesktop = createBrandStory({
  args: {
    "hide-coa-logo": true,
    "site-name": siteNameOnly,
  },
  content: {
    attribution: "oho",
  },
  description: {
    brands: "Endorsed and Standalone",
    summary: "Site Name Only",
  },
});

export const SiteNameOnlyMobile: HeaderStory = {
  args: defaultArgs,
  render: () => html`
    <div class="brand-variations">
      ${siteNameOnlyMobileVariations.map(
        (variation, index) => html`
          <section class="brand-variation">
            <h3>${variation.label}</h3>
            ${renderHeader(
              {
                ...defaultArgs,
                "hide-coa-logo": true,
                "mobile-top-content": variation.mobileTopContent,
                "hide-mobile-bottom-row": variation.hideMobileBottomRow,
                "site-name": siteNameOnly,
              },
              {
                attribution: "oho",
                navigationId: `site-name-only-navigation-${index + 1}`,
              }
            )}
            ${renderStorySettings([
              "hide-coa-logo",
              `mobile-top-content="${variation.mobileTopContent}"`,
              ...(variation.hideMobileBottomRow ? ["hide-mobile-bottom-row"] : []),
              `site-name="${siteNameOnly}"`,
            ])}
          </section>
        `
      )}
    </div>
  `,
  decorators: [...eventActionDecorators, withStoryStyles, withBrandVariationStyles],
  parameters: {
    controls: {
      disable: true,
    },
  },
};
