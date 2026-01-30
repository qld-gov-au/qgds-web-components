import { html, TemplateResult, nothing } from "lit";
import { choose } from "lit/directives/choose.js";

/**
 * Returns a semantic heading element for use in Lit templates.
 * @param heading
 * @param headingLevel
 * @param className
 * @returns A TemplateResult containing the appropriate heading element, or nothing if no heading is provided.
 */

export function semanticHeading(
  heading: string | TemplateResult,
  headingLevel: string | number,
  className: string = "heading",
): TemplateResult | typeof nothing {
  if (!heading) return nothing;

  // Standardize input: "H2" -> 2, 2 -> 2
  const level = parseInt(String(headingLevel).replace(/\D/g, ""), 10);

  return html`
    ${choose(
      level,
      [
        [2, () => html`<h2 class=${className}>${heading}</h2>`],
        [4, () => html`<h4 class=${className}>${heading}</h4>`],
        [5, () => html`<h5 class=${className}>${heading}</h5>`],
        [6, () => html`<h6 class=${className}>${heading}</h6>`],
      ],
      () => html`<h3 class=${className}>${heading}</h3>`, // Default case
    )}
  `;
}
