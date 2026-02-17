import { css } from "lit";

/**
 * Shared reset styles for all QGDS components
 * Uses Constructable Stylesheets for maximum efficiency
 * Only loaded once in memory, shared across all component instances
 */
export const resetStyles = css`
  /* Box sizing reset */
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  /* Remove default margins and padding */
  :host {
    margin: 0;
    padding: 0;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* Reset common elements */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  li,
  blockquote,
  figure,
  figcaption {
    margin: 0;
    padding: 0;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  /* List styles */
  ul,
  ol {
    list-style: none;
  }

  /* Link styles */
  a {
    color: inherit;
    text-decoration: inherit;
  }

  /* Button reset */
  button {
    margin: 0;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  /* Form elements */
  input,
  textarea,
  select {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
  }

  /* Images */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* Ensure components don't leak styles */
  :host {
    display: block;
    isolation: isolate;
  }
`;

export const printStyles = css`
  .no-print {
    display: none !important;
  }
`;
