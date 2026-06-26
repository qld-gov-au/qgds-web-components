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
import "./qgds-file-upload/qgds-file-upload";

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

      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>File Upload</legend>
        <qgds-file-upload
          id="file"
          name="file"
          label="File"
          indicate-if="required"
          required
          @qgds-change=${action("file-upload:qgds-change")}
          multiple
        ></qgds-file-upload>
      </fieldset>

      <div style=${buttonRowStyle}>
        <button type="submit" style=${buttonStyle} formnovalidate>Submit</button>
        <button type="reset" style=${resetButtonStyle}>Reset</button>
      </div>
    </form>
  `,
};

// ── Story: Custom Validation States ───────────────────────────────────────────────

/**
 * Custom validation is highly recommended.
 * Display QGDS validation states rather than built-in default HTML validation by adding novalidate attribute
 * and attaching a submit event listener to the form.
 * Update `validation-state`, `validation-message` and `aria-invalid` attributes for each component based on validation logic.
 * This method may also be used in combination with server side validation, by awaiting the submission response.
 * Server validation should be mandatory for any form submission and should not be left to the client.
 * It can also validate against complex data rules which the client may not have access to.
 */
export const CustomValidation: Story = {
  name: "Custom Validation",
  render: (args) => html`
    <form style=${sectionStyle} @submit=${handleServerSideValidationSubmit} novalidate>
      <fieldset style=${fieldsetStyle}>
        <legend style=${legendStyle}>Custom validation</legend>

        <qgds-text-input
          id="ServerValidationOnly_name"
          name="name"
          label="Full name"
          hint="Required field"
          variant=${args.variant}
          indicate-if=${args["indicate-if"]}
          required
        ></qgds-text-input>

        <qgds-textarea
          id="ServerValidationOnly_info"
          name="info"
          label="Information"
          variant=${args.variant}
          indicate-if=${args["indicate-if"]}
          required
        ></qgds-textarea>

        <qgds-select
          id="ServerValidationOnly_pet"
          name="pet"
          label="Favourite pet"
          variant=${args.variant}
          indicate-if=${args["indicate-if"]}
          required
        >
          <qgds-select-option value="dog" label="Dog"></qgds-select-option>
          <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        </qgds-select>

        <qgds-checkbox-group
          id="ServerValidationOnly_interests"
          name="interests"
          label="Interests"
          indicate-if=${args["indicate-if"]}
          required
        >
          <qgds-checkbox value="design" label="Design"></qgds-checkbox>
          <qgds-checkbox value="code" label="Code"></qgds-checkbox>
        </qgds-checkbox-group>

        <qgds-radio-group
          id="ServerValidationOnly_priority"
          name="priority"
          label="Priority"
          indicate-if=${args["indicate-if"]}
          required
        >
          <qgds-radio value="low" label="Low"></qgds-radio>
          <qgds-radio value="high" label="High"></qgds-radio>
        </qgds-radio-group>

        <qgds-file-upload
          id="file"
          name="file"
          label="File"
          indicate-if="required"
          required
          @qgds-change=${action("file-upload:qgds-change")}
          multiple
        ></qgds-file-upload>
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

        <qgds-file-upload
          id="file"
          name="file"
          label="File"
          indicate-if="required"
          required
          @qgds-change=${action("file-upload:qgds-change")}
          multiple
          disabled
        ></qgds-file-upload>
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
        native-validate
      ></qgds-text-input>

      <qgds-select
        id="av-pet"
        name="av-pet"
        label="Favourite pet"
        hint="Required"
        indicate-if="required"
        required
        native-validate
      >
        <qgds-select-option value="dog" label="Dog"></qgds-select-option>
        <qgds-select-option value="cat" label="Cat"></qgds-select-option>
        <qgds-select-option value="hamster" label="Hamster"></qgds-select-option>
      </qgds-select>

      <qgds-checkbox-group
        id="av-priority"
        name="av-priority"
        label="Priority"
        hint="Required"
        indicate-if="required"
        required
        native-validate
        @qgds-change=${action("checkbox-group:qgds-change")}
      >
        <qgds-checkbox value="low" label="Low"></qgds-checkbox>
        <qgds-checkbox value="medium" label="Medium"></qgds-checkbox>
        <qgds-checkbox value="high" label="High"></qgds-checkbox>
      </qgds-checkbox-group>

      <qgds-file-upload
        id="file"
        name="file"
        label="File"
        indicate-if="required"
        required
        @qgds-change=${action("file-upload:qgds-change")}
        multiple
        native-validate
      ></qgds-file-upload>

      <div style=${buttonRowStyle}>
        <button type="submit" style=${buttonStyle}>Validate &amp; Submit</button>
        <button type="reset" style=${resetButtonStyle}>Reset</button>
      </div>
    </form>
  `,
};
