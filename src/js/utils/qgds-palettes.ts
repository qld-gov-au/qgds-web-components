export const paletteVariants = [
  "bright",
  "tint",
  "alt",
  "bold",
  "strong",
  "dark",
];

export function PaletteBackgrounds() {
  let mappedStyles = paletteVariants.map(
    (variant) => `
      :host([${variant}]) {
        background-color: var(--palette-${variant}-background);
      }
    `
  );

  mappedStyles.push(`
    @media (prefers-color-scheme: dark) {
      :host,
      :host([bright]),
      :host([tint]),
      :host([alt]),
      :host([bold]),
      :host([strong]),
      :host([dark]) {
        background-color: var(--palette-dark-background);
      }
    }
  `);

  return mappedStyles.join("\n");
}
