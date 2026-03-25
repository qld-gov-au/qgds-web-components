/**
 * Form Field Abstract Class — Integration Test Page
 *
 * A single-page story that exercises every key behaviour from
 * QGDSFormField and QGDSFieldGroupBase:
 *
 *  • value sync → ElementInternals (form submission)
 *  • auto-validation  (required + valueMissing)
 *  • validationState  ("success" / "error")
 *  • validationMessage
 *  • disabled / readOnly propagation
 *  • formResetCallback  (native <button type="reset">)
 *  • formDisabledCallback  (fieldset[disabled])
 *  • indicateIf  ("required" / "optional")
 *  • hint rendering
 *  • group value aggregation  (checkbox-group → string[], radio-group → string)
 */

import type { Meta, StoryObj } from "@storybook/web-components";
import { action } from "storybook/actions";
import { html } from "lit";
import { FormIndicateIf, FormVariant } from "../../types/forms";
import { handleServerSideValidationSubmit } from "./__mocks__/handleSubmit";

// ── Register all components used in this story ─────────────────────────────
import "./qgds-text-input/qgds-text-input";
import "./qgds-textarea/qgds-textarea";
import "./qgds-select/qgds-select";
import "./qgds-select/qgds-select-option";
import "./qgds-checkbox/qgds-checkbox";
import "./qgds-checkbox-group/qgds-checkbox-group";
import "./qgds-radio/qgds-radio";
import "./qgds-radio-group/qgds-radio-group";

// ── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Components/Forms/Data and validation",
  tags: ["autodocs"],
  component: "qgds-form-field",
  parameters: {
    docs: {
      description: {
        component: `
Integration test page for \`QGDSFormField\` and \`QGDSFieldGroupBase\` abstract classes.

Each story exercises a specific lifecycle concern so you can verify it in
isolation in the Storybook canvas.
        `,
      },
    },
  },
  args: {
    "indicate-if": "required",
    variant: "outlined",
  },
  argTypes: {
    "indicate-if": {
      control: { type: "select" },
      options: ["required", "optional"] satisfies FormIndicateIf[],
    },
    variant: { options: ["filled", "outlined"] satisfies FormVariant[], control: { type: "select" } },
  },
};

export default meta;
type Story = StoryObj;

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Log form data on submit so the Actions panel shows exactly what
 * ElementInternals reported back to the form.
 */
const handleSubmit = (e: SubmitEvent) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = Array.from(formData.keys()).reduce(
    (acc, key) => {
      const values = formData.getAll(key);
      acc[key] = values.length > 1 ? values : values[0];
      return acc;
    },
    {} as Record<string, FormDataEntryValue | FormDataEntryValue[]>
  );
  action("form-submit")(data);
};

const sectionStyle = `
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
  font-family: sans-serif;
`;

const fieldsetStyle = `
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 1rem;
`;

const legendStyle = `
  font-weight: 600;
  font-size: 0.875rem;
  color: #444;
  padding: 0 0.25rem;
`;

const buttonRowStyle = `
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const buttonStyle = `
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  border: 1px solid #1a73e8;
  background: #1a73e8;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
`;

const resetButtonStyle = `
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  border: 1px solid #aaa;
  background: white;
  color: #444;
  cursor: pointer;
  font-size: 0.875rem;
`;

// ── Story: Full Form (submit + reset) ──────────────────────────────────────

/**
 * A complete form that includes all three component types.
 * Submit to see serialised FormData in the Actions panel.
 * Reset clears all fields and validation state (formResetCallback).
 */
export const FullForm: Story = {
  name: "Full Form — Submit & Reset",
  render: () => html`
    <form style=${sectionStyle} @submit=${handleSubmit}>
      <!-- ── Text input ──────────────────────────────────────── -->
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Text Input</legend>
        <qgds-text-input
          id="fullname"
          name="fullname"
          label="Full name"
          hint="As it appears on your ID"
          placeholder="e.g. Jane Smith"
          indicate-if="required"
          required
        ></qgds-text-input>

        <qgds-text-input
          id="email"
          name="email"
          label="Email address"
          hint="We'll never share your email"
          placeholder="jane@example.com"
          type="email"
          indicate-if="optional"
        ></qgds-text-input>
      </fieldset>

      <!-- ── Select ─────────────────────────────────────────── -->
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Select</legend>
        <qgds-select id="pet" name="pet" label="Favourite pet" hint="Choose one" indicate-if="required" required>
          <qgds-select-option value="dog" label="Dog"></qgds-select-option>
          <qgds-select-option value="cat" label="Cat"></qgds-select-option>
          <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
          <qgds-select-option value="parrot" label="Parrot"></qgds-select-option>
        </qgds-select>
      </fieldset>

      <!-- ── Checkbox group ─────────────────────────────────── -->
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Checkbox Group</legend>
        <qgds-checkbox-group
          id="interests"
          name="interests"
          label="Interests"
          hint="Select all that apply"
          indicate-if="required"
          required
          @qgds-change=${action("checkbox-group:qgds-change")}
        >
          <qgds-checkbox value="design" label="Design"></qgds-checkbox>
          <qgds-checkbox value="code" label="Code"></qgds-checkbox>
          <qgds-checkbox value="research" label="Research"></qgds-checkbox>
        </qgds-checkbox-group>
      </fieldset>

      <!-- ── Radio group ────────────────────────────────────── -->
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Radio Group</legend>
        <qgds-radio-group
          id="priority"
          name="priority"
          label="Priority"
          hint="Choose one option"
          indicate-if="required"
          required
          @qgds-change=${action("radio-group:qgds-change")}
        >
          <qgds-radio value="low" label="Low"></qgds-radio>
          <qgds-radio value="medium" label="Medium"></qgds-radio>
          <qgds-radio value="high" label="High"></qgds-radio>
        </qgds-radio-group>
      </fieldset>

      <div style=${buttonRowStyle}>
        <button type="submit" style=${buttonStyle} fromnovalidate>Submit</button>
        <button type="reset" style=${resetButtonStyle}>Reset</button>
      </div>
    </form>
  `,
};

// ── Story: Validation States ───────────────────────────────────────────────

/**
 * Simulates a form submission where the server alone is responsible for validation.
 * Basic HTML5 validation should prevent the form submission, for example a required field is empty.
 * When a form is submitted, the page is refreshed and rerendered with valid and invalid states, including validation messages.
 * Server validation is required for any form submission and should not be left to the client.
 * It can also validate against complex data rules which the client may not have access to.
 */
export const ServerValidationOnly: Story = {
  name: "Validation — server-side",
  render: (args) => html`
    <form style=${sectionStyle} @submit=${handleServerSideValidationSubmit}>
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Server validation (simulated)</legend>

        <qgds-text-input
          id="ServerValidationOnly_name"
          name="name"
          label="Full name"
          hint="Required field"
          variant=${args.variant}
          required
        ></qgds-text-input>

        <qgds-textarea
          id="ServerValidationOnly_info"
          name="info"
          label="Information"
          variant=${args.variant}
          required
        ></qgds-textarea>

        <qgds-select id="ServerValidationOnly_pet" name="pet" label="Favourite pet" variant=${args.variant} required>
          <qgds-select-option value="dog" label="Dog"></qgds-select-option>
          <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        </qgds-select>

        <qgds-checkbox-group id="ServerValidationOnly_interests" name="interests" label="Interests" required>
          <qgds-checkbox value="design" label="Design"></qgds-checkbox>
          <qgds-checkbox value="code" label="Code"></qgds-checkbox>
        </qgds-checkbox-group>

        <qgds-radio-group id="ServerValidationOnly_priority" name="priority" label="Priority" required>
          <qgds-radio value="low" label="Low"></qgds-radio>
          <qgds-radio value="high" label="High"></qgds-radio>
        </qgds-radio-group>
      </fieldset>

      <div style=${buttonRowStyle}>
        <button type="submit" style=${buttonStyle}>Submit</button>
        <button type="reset" style=${resetButtonStyle}>Reset</button>
      </div>
    </form>
  `,
};

// ── Story: Disabled State ──────────────────────────────────────────────────

/**
 * All fields disabled via the disabled attribute.
 * Also tests formDisabledCallback — wrapping in a disabled <fieldset>
 * triggers the native form-associated disabled path.
 */
export const DisabledState: Story = {
  name: "Disabled — Attribute & fieldset[disabled]",
  render: () => html`
    <div style=${sectionStyle}>
      <!-- Via attribute -->
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>disabled attribute</legend>

        <qgds-text-input
          id="name-disabled"
          name="name-disabled"
          label="Full name"
          value="Jane Smith"
          disabled
        ></qgds-text-input>

        <qgds-select id="pet-disabled" name="pet-disabled" label="Favourite pet" disabled>
          <qgds-select-option value="dog" label="Dog"></qgds-select-option>
          <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        </qgds-select>

        <qgds-checkbox-group id="interests-disabled" name="interests-disabled" label="Interests" disabled>
          <qgds-checkbox value="design" label="Design" checked></qgds-checkbox>
          <qgds-checkbox value="code" label="Code"></qgds-checkbox>
        </qgds-checkbox-group>

        <qgds-radio-group id="priority-disabled" name="priority-disabled" label="Priority" disabled>
          <qgds-radio value="low" label="Low"></qgds-radio>
          <qgds-radio value="medium" label="Medium" checked></qgds-radio>
          <qgds-radio value="high" label="High"></qgds-radio>
        </qgds-radio-group>
      </fieldset>

      <!-- Via fieldset[disabled] — triggers formDisabledCallback -->
      <form>
        <fieldset disabled style=${fieldsetStyle}>
          <legend style=${legendStyle}>fieldset[disabled] — formDisabledCallback</legend>

          <qgds-text-input
            id="name-fieldset-disabled"
            name="name-fieldset-disabled"
            label="Full name"
            value="Jane Smith"
          ></qgds-text-input>

          <qgds-select id="pet-fieldset-disabled" name="pet-fieldset-disabled" label="Favourite pet">
            <qgds-select-option value="dog" label="Dog"></qgds-select-option>
            <qgds-select-option value="cat" label="Cat"></qgds-select-option>
          </qgds-select>
        </fieldset>
      </form>
    </div>
  `,
};

// ── Story: Read-only State ─────────────────────────────────────────────────

/**
 * Exercises the readOnly property on text-input.
 */
export const ReadOnlyState: Story = {
  name: "Read-only",
  render: () => html`
    <div style=${sectionStyle}>
      <qgds-text-input
        id="name-readonly"
        name="name-readonly"
        label="Full name"
        value="Jane Smith"
        hint="This field cannot be edited"
        readonly
      ></qgds-text-input>

      <qgds-text-input
        id="email-readonly"
        name="email-readonly"
        label="Email address"
        value="jane@example.com"
        type="email"
        hint="Contact support to change your email"
        readonly
      ></qgds-text-input>
    </div>
  `,
};

// ── Story: indicateIf variants ─────────────────────────────────────────────

/**
 * Shows all three indicateIf variants: "required", "optional", and "none" (default).
 */
export const IndicateIf: Story = {
  name: "indicateIf — Required / Optional / None",
  render: () => html`
    <div style=${sectionStyle}>
      <qgds-text-input
        id="field-required"
        name="field-required"
        label="Required field"
        hint="indicate-if=required shows an asterisk"
        indicate-if="required"
        required
      ></qgds-text-input>

      <qgds-text-input
        id="field-optional"
        name="field-optional"
        label="Optional field"
        hint="indicate-if=optional shows (optional)"
        indicate-if="optional"
      ></qgds-text-input>

      <qgds-text-input
        id="field-none"
        name="field-none"
        label="No indicator"
        hint="No indicator shown (default)"
      ></qgds-text-input>
    </div>
  `,
};

// ── Story: Auto-validation on submit ──────────────────────────────────────

/**
 * Required fields with no value — submitting the form triggers browser
 * constraint validation and exercices checkValidity() / reportValidity()
 * in the base class. The Actions panel shows "form-submit" only when all
 * fields are valid.
 */
export const AutoValidation: Story = {
  name: "Auto-validation — Required Fields",
  render: () => html`
    <form style=${sectionStyle} @submit=${handleSubmit}>
      <p style="font-size:0.875rem;color:#444;margin:0">
        Leave one or more fields empty and click <strong>Validate</strong> to trigger <code>reportValidity()</code> from
        the base class.
      </p>

      <qgds-text-input
        id="av-name"
        name="av-name"
        label="Full name"
        hint="Required"
        indicate-if="required"
        required
      ></qgds-text-input>

      <qgds-select id="av-pet" name="av-pet" label="Favourite pet" hint="Required" indicate-if="required" required>
        <qgds-select-option value="dog" label="Dog"></qgds-select-option>
        <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      </qgds-select>

      <qgds-radio-group
        id="av-priority"
        name="av-priority"
        label="Priority"
        hint="Required"
        indicate-if="required"
        required
        @qgds-change=${action("radio-group:qgds-change")}
      >
        <qgds-radio value="low" label="Low"></qgds-radio>
        <qgds-radio value="medium" label="Medium"></qgds-radio>
        <qgds-radio value="high" label="High"></qgds-radio>
      </qgds-radio-group>

      <div style=${buttonRowStyle}>
        <button type="submit" style=${buttonStyle}>Validate &amp; Submit</button>
        <button type="reset" style=${resetButtonStyle}>Reset</button>
      </div>
    </form>
  `,
};

// ── Story: Variants (filled / outlined) ───────────────────────────────────

/**
 * Compares filled vs outlined (default) variants side-by-side.
 */
export const Variants: Story = {
  name: "Variants — Filled vs Outlined",
  render: () => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;max-width:700px;font-family:sans-serif;">
      <div>
        <p style="font-weight:600;margin:0 0 0.75rem;font-size:0.875rem;">Outlined (default)</p>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <qgds-text-input
            id="outlined-name"
            name="outlined-name"
            label="Full name"
            placeholder="Jane Smith"
          ></qgds-text-input>
          <qgds-select id="outlined-pet" name="outlined-pet" label="Favourite pet">
            <qgds-select-option value="dog" label="Dog"></qgds-select-option>
            <qgds-select-option value="cat" label="Cat"></qgds-select-option>
          </qgds-select>
        </div>
      </div>
      <div>
        <p style="font-weight:600;margin:0 0 0.75rem;font-size:0.875rem;">Filled</p>
        <div style="display:flex;flex-direction:column;gap:1rem;">
          <qgds-text-input
            id="filled-name"
            name="filled-name"
            label="Full name"
            placeholder="Jane Smith"
            variant="filled"
          ></qgds-text-input>
          <qgds-select id="filled-pet" name="filled-pet" label="Favourite pet" filled>
            <qgds-select-option value="dog" label="Dog"></qgds-select-option>
            <qgds-select-option value="cat" label="Cat"></qgds-select-option>
          </qgds-select>
        </div>
      </div>
    </div>
  `,
};
