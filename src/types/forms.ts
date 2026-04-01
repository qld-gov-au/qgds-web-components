export type FormValidationState = "success" | "error";
export type FormIndicateIf = "required" | "optional" | "none";
export type FormVariant = "filled" | "outlined";

/**
 * Shared attributes between text input, textarea, and select. These are not common to radio and checkbox.
 */
export interface IFormControl {
  /**  The visual style of the input, either "filled" or "outlined". */
  variant?: FormVariant;
  /** Displayed text when the value is empty */
  placeholder?: string;
}
