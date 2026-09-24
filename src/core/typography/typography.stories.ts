import type { StoryObj, Meta } from "@storybook/web-components-vite";

import { html } from "lit";

const mockText: string =
  "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.";

const meta: Meta = {
  title: "Core styles/Typography",
  args: {},
};

export default meta;

/**
 * These `.qgds-display-*` utilities allow you to change the size of a font whilst maintaining the correct typography hierarchy
 * Note: The XXL size should also only be used for promotional content
 */

export const Display: StoryObj = {
  name: "Display",
  render: () => {
    return html`
      <h2 class="qgds-display-xxxl">Display XXXL</h2>
      <br />
      <h2 class="qgds-display-xxl">Display XXL</h2>
      <br />
      <h2 class="qgds-display-xl">Display XL</h2>
      <br />
      <h2 class="qgds-display-lg">Display LG</h2>
      <br />
      <h2 class="qgds-display-md">Display MD</h2>
      <br />
      <h2 class="qgds-display-sm">Display SM</h2>
      <br />
      <h2 class="qgds-display-xs">Display XS</h2>
      <br />
    `;
  },
};

/**
 * Default styles for H1-H6 elements.
 *
 * Note: Vertical spacing for typography elements are scoped to a `.qgds-content` parent container
 */
export const Heading: StoryObj = {
  name: "Heading",
  render: () => {
    return html`
      <div class="qgds-content">
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 5</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Default styles for H1-H6 elements.",
      },
      toc: {
        disable: false,
      },
    },
  },
};

export const Paragraph: StoryObj = {
  name: "Paragraphs",
  render: () => {
    return html`
      <div class="qgds-content">
        <p>${mockText}</p>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Use text utilities `qgds-abstract`, `qgds-quote`, and `qgds-caption` to style paragraph elements.",
      },
    },
  },
};

export const Lists: StoryObj = {
  name: "Lists",
  render: () => {
    return html`
      <div class="qgds-content">
        <ul>
          <li>Unordered List 1</li>
          <li>Unordered List 2</li>
          <li>
            Unordered List 3
            <ul>
              <li>Sublist 1</li>
              <li>Sublist 2</li>
            </ul>
          </li>
        </ul>

        <ol>
          <li>Ordered List 1</li>
          <li>Ordered List 2</li>
          <li>
            Ordered List 3
            <ol>
              <li>Sublist 1</li>
              <li>Sublist 2</li>
            </ol>
          </li>
        </ol>

        <dl>
          <dt>Definition List A</dt>
          <dd>Item 1</dd>
          <dd>Item 2</dd>
          <dt>Definition List B</dt>
          <dd>Item 1</dd>
          <dd>Item 2</dd>
        </dl>
      </div>
    `;
  },
};

/**
 * The abstract also known as lead text is useful as a high level introduction used at the top of the page to briefly describe the content. This style of text should only be used once per page if possible.

Abstract text is applied by using the class `.qgds-abstract`
 */
export const Abstract: StoryObj = {
  name: "Abstract",
  render: () => {
    return html` <p class="qgds-abstract">${mockText}</p> `;
  },
};

/**
 * This is a text style for showing direct speech, or attributing text to an identifiable source.
 *
 * Quote text is applied by using the class `.qgds-quote`
 *
 * Note: The Queensland Government Design System provides are more comprehensive `<qgds-blockquote>` component for this purpose.
 */

export const Quote: StoryObj = {
  name: "Quote",
  render: () => {
    return html` <p class="qgds-quote">${mockText}</p> `;
  },
};

/**
 * This is a text style for copy used alongside informational images, hint text, footnotes and references.

Caption text is applied by using the class `.qgds-caption`
 */
export const Caption: StoryObj = {
  name: "Caption",
  render: () => {
    return html` <p class="qgds-caption">${mockText}</p> `;
  },
};

export const Inline: StoryObj = {
  name: "Inline Elements",
  render: () => {
    return html`
      <div class="qgds-content">
        <p>
          Superscript <sup>text</sup>, subscript <sub>text</sub>, <s>strikethrough</s>, <em>emphasis</em>,
          <strong>strong</strong> and <u>underline</u>.
        </p>

        <p><small>Small text</small></p>

        <div class="qgds-palette-default">
          <pre>pre</pre>
          , <kbd>kbd</kbd> and <code>code</code>
        </div>

        <div class="qgds-palette-deep">
          <pre>pre</pre>
          , <kbd>kbd</kbd> and <code>code</code>
        </div>
      </div>
    `;
  },
};
