import type { StoryObj, Meta } from "@storybook/web-components-vite";

import { html } from "lit";

const mockText = html`The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
quick brown fox jumps over the lazy dog.`;

const mockTextWithLink = html`
  The quick brown fox jumps over the lazy dog. The quick brown fox
  <a href="https://en.wikipedia.org/wiki/Typography">jumps over the lazy dog</a>. The quick brown fox jumps over the
  lazy dog.
`;

const meta: Meta = {
  title: "Core styles/Typography",
  args: {},
};

export default meta;

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
    },
  },
};

/**
 * `.qgds-display-*` utilities allow you to change the size of a font whilst maintaining the correct typography hierarchy. All elements in this example are H2.
 * <br>
 * <br>
 * Note: The XXL size should also only be used for promotional content
 */

export const Display: StoryObj = {
  name: "Display",
  render: () => {
    return html`
      <div class="qgds-content">
        <h2 class="qgds-display-xxxl">Display XXXL</h2>
        <h2 class="qgds-display-xxl">Display XXL</h2>
        <h2 class="qgds-display-xl">Display XL</h2>
        <h2 class="qgds-display-lg">Display LG</h2>
        <h2 class="qgds-display-md">Display MD</h2>
        <h2 class="qgds-display-sm">Display SM</h2>
        <h2 class="qgds-display-xs">Display XS</h2>
      </div>
    `;
  },
};

export const Paragraph: StoryObj = {
  name: "Paragraphs",
  render: () => {
    return html`
      <div class="qgds-content">
        <p class="qgds-abstract">${html`${mockText}`}</p>
        <p class="qgds-quote">${mockText}</p>
        <p>${mockText}</p>
        <p>${mockTextWithLink}</p>
        <p class="qgds-caption">${mockText}</p>
      </div>
    `;
  },
  parameters: {
    docs: {
      description: {
        story: "Use text utilities `qgds-abstract`, `qgds-quote`, and `qgds-caption` for paragraph elements.",
      },
    },
  },
};

export const Lists: StoryObj = {
  name: "Lists",
  render: () => {
    return html`
      <div class="qgds-content is-limit-width">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum vel soluta in? Quisquam at, illo debitis
          laudantium enim ullam ab molestiae voluptatibus libero fugit esse inventore unde et incidunt voluptate.
        </p>
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
          <dt>Description Term</dt>
          <dd>Description details</dd>
          <dd>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dt">Description details</a>
          </dd>
          <dt>Description Term</dt>
          <dd>Description details</dd>
          <dd>Description details</dd>
        </dl>
      </div>
    `;
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
          <p><pre>pre</pre>
          , <kbd>kbd</kbd> and <code>code</code></p>
        </div>

        <div class="qgds-palette-deep">
          <p><pre>pre</pre>
          , <kbd>kbd</kbd> and <code>code</code></p>
        </div>
      </div>
    `;
  },
};
