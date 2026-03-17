export type FormValidationState = "success" | "error";
export type FormIndicateIfOptions = "required" | "optional" | "none";
export type FormVariantOptions = "filled" | "outlined";

/**
 * Shared attributes between text input, textarea, and select. These are not common to radio and checkbox.
 */
export interface IFormControl {
  /**  The visual style of the input, either "filled" or "outlined". */
  variant: FormVariantOptions;
  /** Displayed text when the value is empty */
  placeholder: string;
}
