import { html, TemplateResult, nothing } from "lit";
import { choose } from "lit/directives/choose.js";
import { ifDefined } from "lit/directives/if-defined.js";

/**
 * Returns a semantic heading element for use in Lit templates.
 * @param heading
 * @param headingLevel
 * @param className
 * @param {String} [id]
 * @returns A TemplateResult containing the appropriate heading element, or nothing if no heading is provided.
 */

export function semanticHeading(
  heading: string | TemplateResult,
  headingLevel: string | number,
  className: string = "heading",
  id?: string
): TemplateResult | typeof nothing {
  if (!heading) return nothing;

  // Standardize input: "H2" -> 2, 2 -> 2
  const level = parseInt(String(headingLevel).replace(/\D/g, ""), 10);
  return html`
    ${choose(
      level,
      [
        [1, () => html`<h1 class=${className} id=${ifDefined(id)}>${heading}</h1>`],
        [2, () => html`<h2 class=${className} id=${ifDefined(id)}>${heading}</h2>`],
        [3, () => html`<h3 class=${className} id=${ifDefined(id)}>${heading}</h3>`],
        [4, () => html`<h4 class=${className} id=${ifDefined(id)}>${heading}</h4>`],
        [5, () => html`<h5 class=${className} id=${ifDefined(id)}>${heading}</h5>`],
        [6, () => html`<h6 class=${className} id=${ifDefined(id)}>${heading}</h6>`],
      ],
      () => html`<h3 class=${className} id=${ifDefined(id)}>${heading}</h3>` // Default case
    )}
  `;
}
