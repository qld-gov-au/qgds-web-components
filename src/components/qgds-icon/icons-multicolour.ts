// List of icons with multiple colours, which use background-image rather than mask-image
// Generated from src/scss/utilities/_icons-multicolours.list.scss

export const ICONS_MULTICOLOUR = [
  "status-cancel",
  "status-danger",
  "status-error",
  "status-information",
  "status-maintenance",
  "status-success",
  "status-warning",
] as const;

export type IconMulticolour = (typeof ICONS_MULTICOLOUR)[number];

export function isMulticolourIcon(iconId: string): boolean {
  return ICONS_MULTICOLOUR.includes(iconId as IconMulticolour);
}
