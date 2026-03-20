import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./qgds-select";
import "./qgds-select-option";
import "./qgds-select-optgroup";
import type { QGDSSelect } from "./qgds-select";

describe("qgds-select", () => {
  let element: QGDSSelect;

  beforeEach(() => {
    element = document.createElement("qgds-select");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe("Rendering and default properties", () => {
    it("should render with default properties", async () => {
      await element.updateComplete;

      expect(element.label).toBeUndefined();
      expect(element.disabled).toBe(false);
      expect(element.required).toBe(false);
      expect(element.variant).toBeUndefined();
      expect(element.multiple).toBe(false);
      expect(element.autofocus).toBe(false);
      expect(element.placeholder).toBe("Please select");
      expect(element.value).toBe("");

      const select = element.shadowRoot?.querySelector("select");
      expect(select).toBeTruthy();
    });

    it("should render label correctly", async () => {
      element.label = "Choose an option";
      await element.updateComplete;

      const label = element.shadowRoot?.querySelector("label");
      expect(label?.textContent?.trim()).toContain("Choose an option");
    });

    it("should render hint text when provided", async () => {
      element.hint = "This is a hint";
      await element.updateComplete;

      const hint = element.shadowRoot?.querySelector(".qgds-form-hint");
      expect(hint?.textContent).toBe("This is a hint");
    });

    it("should render optional text when provided", async () => {
      element.label = "Label";
      element.indicateIf = "optional";
      await element.updateComplete;

      const optional = element.shadowRoot?.querySelector(".qgds-form-label-optional");
      expect(optional?.textContent?.trim()).toContain("(optional)");
    });

    it("should show required indicator when required", async () => {
      element.label = "Label";
      element.required = true;
      element.indicateIf = "required";
      await element.updateComplete;

      const required = element.shadowRoot?.querySelector(".qgds-form-label-required");
      expect(required).toBeTruthy();
      expect(required?.textContent).toContain("*");
    });

    it("should render placeholder option for single select", async () => {
      element.placeholder = "Select an option";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      const placeholderOption = select?.querySelector('option[value=""]');
      expect(placeholderOption?.textContent).toBe("Select an option");
    });

    it("should not render placeholder option for multiple select", async () => {
      element.multiple = true;
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      const placeholderOption = select?.querySelector('option[value=""]');
      expect(placeholderOption).toBeNull();
    });
  });

  describe("Form integration", () => {
    let form: HTMLFormElement;

    beforeEach(() => {
      form = document.createElement("form");
      document.body.appendChild(form);
    });

    afterEach(() => {
      form.remove();
    });

    it("should participate in form submission", async () => {
      element.setAttribute("name", "pet");
      element.value = "cat";
      form.appendChild(element);
      await element.updateComplete;

      const formData = new FormData(form);
      expect(formData.get("pet")).toBe("cat");
    });

    it("should not submit value when disabled", async () => {
      element.setAttribute("name", "pet");
      element.value = "cat";
      element.disabled = true;
      form.appendChild(element);
      await element.updateComplete;

      const formData = new FormData(form);
      expect(formData.get("pet")).toBeNull();
    });

    it("should reset value on form reset", async () => {
      element.value = "cat";
      form.appendChild(element);
      await element.updateComplete;

      element.formResetCallback();
      expect(element.value).toBe("");
    });

    it("should restore form state", async () => {
      await element.updateComplete;
      element.formStateRestoreCallback("cat");
      expect(element.value).toBe("cat");
    });

    it("should handle form disabled callback", async () => {
      await element.updateComplete;
      element.formDisabledCallback(true);
      expect(element.disabled).toBe(true);
    });
  });

  describe("Single select behavior", () => {
    beforeEach(async () => {
      const option1 = document.createElement("qgds-select-option");
      option1.value = "dog";
      option1.label = "Dog";

      const option2 = document.createElement("qgds-select-option");
      option2.value = "cat";
      option2.label = "Cat";

      const option3 = document.createElement("qgds-select-option");
      option3.value = "hamster";
      option3.label = "Hamster";

      element.appendChild(option1);
      element.appendChild(option2);
      element.appendChild(option3);

      await element.updateComplete;
      // Wait for slot change to process
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it("should render native options from qgds-select-option children", () => {
      const select = element.shadowRoot?.querySelector("select");
      const options = select?.querySelectorAll<HTMLOptionElement>("option:not([value=''])");
      expect(options?.length).toBe(3);
      expect(options?.[0]?.value).toBe("dog");
      expect(options?.[1]?.value).toBe("cat");
      expect(options?.[2]?.value).toBe("hamster");
    });

    it("should update value when option is selected", async () => {
      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      select.value = "cat";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe("cat");
    });

    it("should emit custom change event with correct detail", async () => {
      const changeHandler = vi.fn();
      element.addEventListener("change", changeHandler);

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      select.value = "cat";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      await element.updateComplete;

      expect(changeHandler).toHaveBeenCalledOnce();
      const event = changeHandler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({
        value: "cat",
        multiple: false,
      });
    });

    it("should sync native select value when value property changes", async () => {
      element.value = "hamster";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      expect(select?.value).toBe("hamster");
    });

    it("should handle disabled options", async () => {
      const option = element.querySelector("qgds-select-option");
      if (!option) throw new Error("Option element not found");

      option.disabled = true;
      await option.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const select = element.shadowRoot?.querySelector("select");
      const nativeOption = select?.querySelector<HTMLOptionElement>('option[value="dog"]');
      expect(nativeOption?.disabled).toBe(true);
    });

    it("should handle selected attribute", async () => {
      const option = element.querySelectorAll("qgds-select-option")[1];
      if (!option) throw new Error("Option element not found");

      option.selected = true;
      await option.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const select = element.shadowRoot?.querySelector("select");
      const nativeOption = select?.querySelector<HTMLOptionElement>('option[value="cat"]');
      expect(nativeOption?.selected).toBe(true);
    });
  });

  describe("Multiple select behavior", () => {
    beforeEach(async () => {
      element.multiple = true;

      const option1 = document.createElement("qgds-select-option");
      option1.value = "dog";
      option1.label = "Dog";

      const option2 = document.createElement("qgds-select-option");
      option2.value = "cat";
      option2.label = "Cat";

      const option3 = document.createElement("qgds-select-option");
      option3.value = "hamster";
      option3.label = "Hamster";

      element.appendChild(option1);
      element.appendChild(option2);
      element.appendChild(option3);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it("should set multiple attribute on native select", () => {
      const select = element.shadowRoot?.querySelector("select");
      expect(select?.multiple).toBe(true);
    });

    it("should handle multiple value selection with comma-separated values", async () => {
      element.value = "dog,cat";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      const selectedValues = Array.from(select.selectedOptions).map((opt) => opt.value);
      expect(selectedValues).toEqual(["dog", "cat"]);
    });

    it("should update value when multiple options are selected", async () => {
      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      // Select multiple options
      const options = Array.from(select.options);
      options[0].selected = true;
      options[2].selected = true;

      select.dispatchEvent(new Event("change", { bubbles: true }));
      await element.updateComplete;

      expect(element.value).toBe("dog,hamster");
    });

    it("should emit change event with array value for multiple select", async () => {
      const changeHandler = vi.fn();
      element.addEventListener("change", changeHandler);

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      const options = Array.from(select.options);
      options[0].selected = true;
      options[1].selected = true;

      select.dispatchEvent(new Event("change", { bubbles: true }));
      await element.updateComplete;

      expect(changeHandler).toHaveBeenCalledOnce();
      const event = changeHandler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toEqual({
        value: ["dog", "cat"],
        multiple: true,
      });
    });

    it("should handle size attribute for multiple select", async () => {
      element.size = 5;
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      expect(select?.getAttribute("size")).toBe("5");
    });

    it("should work with getSelectedValues and setSelectedValues methods", () => {
      element.setSelectedValues(["cat", "hamster"]);
      expect(element.getSelectedValues()).toEqual(["cat", "hamster"]);
      expect(element.value).toBe("cat,hamster");
    });

    it("should handle valueAsArray getter and setter", () => {
      element.valueAsArray = ["dog", "hamster"];
      expect(element.valueAsArray).toEqual(["dog", "hamster"]);
      expect(element.value).toBe("dog,hamster");
    });
  });

  describe("Validation", () => {
    it("should validate required field", async () => {
      element.required = true;
      await element.updateComplete;

      const isValid = element.checkValidity();
      expect(isValid).toBe(false);

      element.value = "cat";
      await element.updateComplete;

      const isValidAfter = element.checkValidity();
      expect(isValidAfter).toBe(true);
    });

    it("should show error message when invalid", async () => {
      element.validationState = "error";
      element.validationMessage = "Please select an option";
      await element.updateComplete;

      const errorMessage = element.shadowRoot?.querySelector(".qgds-validation-message");
      expect(errorMessage?.textContent?.trim()).toContain("Please select an option");
    });

    it("should show success message when valid", async () => {
      element.validationState = "success";
      element.validationMessage = "Great choice!";
      await element.updateComplete;

      const successMessage = element.shadowRoot?.querySelector(".qgds-validation-message");
      expect(successMessage?.textContent?.trim()).toContain("Great choice!");
    });

    it("should auto-validate after change when required", async () => {
      element.required = true;
      await element.updateComplete;

      const option = document.createElement("qgds-select-option");
      option.value = "cat";
      option.label = "Cat";
      element.appendChild(option);
      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      select.value = "cat";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      await element.updateComplete;
    });

    it("should validate required multiple select", async () => {
      element.required = true;
      element.multiple = true;
      await element.updateComplete;

      expect(element.checkValidity()).toBe(false);

      element.value = "dog,cat";
      await element.updateComplete;

      expect(element.checkValidity()).toBe(true);
    });

    it("should focus select on reportValidity failure", async () => {
      element.required = true;
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      const focusSpy = vi.spyOn(select, "focus");

      element.reportValidity();

      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe("Slot validation and filtering", () => {
    it("should warn when invalid elements are slotted", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");

      const invalidDiv = document.createElement("div");
      invalidDiv.textContent = "Invalid content";
      element.appendChild(invalidDiv);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("qgds-select only accepts qgds-select-option and qgds-select-optgroup elements"),
        expect.any(Array)
      );

      consoleWarnSpy.mockRestore();
    });

    it("should only process valid qgds-select-option elements", async () => {
      const option = document.createElement("qgds-select-option");
      option.value = "cat";
      option.label = "Cat";

      const invalidSpan = document.createElement("span");
      invalidSpan.textContent = "Invalid";

      element.appendChild(option);
      element.appendChild(invalidSpan);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const select = element.shadowRoot?.querySelector("select");
      const options = select?.querySelectorAll<HTMLOptionElement>("option:not([value=''])");
      expect(options?.length).toBe(1);
      expect(options?.[0]?.value).toBe("cat");
    });

    it("should process qgds-select-optgroup elements", async () => {
      const optgroup = document.createElement("qgds-select-optgroup");
      optgroup.label = "Pets";

      const option1 = document.createElement("qgds-select-option");
      option1.value = "dog";
      option1.label = "Dog";

      const option2 = document.createElement("qgds-select-option");
      option2.value = "cat";
      option2.label = "Cat";

      optgroup.appendChild(option1);
      optgroup.appendChild(option2);
      element.appendChild(optgroup);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const select = element.shadowRoot?.querySelector("select");
      const nativeOptgroup = select?.querySelector("optgroup");
      expect(nativeOptgroup?.label).toBe("Pets");

      const options = nativeOptgroup?.querySelectorAll("option");
      expect(options?.length).toBe(2);
      expect(options?.[0].value).toBe("dog");
      expect(options?.[1].value).toBe("cat");
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria attributes", async () => {
      element.required = true;
      element.value = "cat"; // valid value keeps aria-invalid false
      element.hint = "Select your favorite pet";
      await element.updateComplete;
      await element.updateComplete; // flush validation state re-render

      const select = element.shadowRoot?.querySelector("select");
      expect(select?.getAttribute("aria-required")).toBe("true");
      expect(select?.getAttribute("aria-invalid")).toBe("false");

      const describedBy = select?.getAttribute("aria-describedby");
      expect(describedBy).toContain("-hint");
    });

    it("should set aria-invalid when invalid", async () => {
      element.validationState = "error";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      expect(select?.getAttribute("aria-invalid")).toBe("true");
    });

    it("should include error message in aria-describedby when invalid", async () => {
      element.validationState = "error";
      element.validationMessage = "Error message";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      const describedBy = select?.getAttribute("aria-describedby");
      expect(describedBy).toContain("-error");
    });

    it("should include success message in aria-describedby when valid", async () => {
      element.validationState = "success";
      element.validationMessage = "Success message";
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      const describedBy = select?.getAttribute("aria-describedby");
      expect(describedBy).toContain("-success");
    });

    it("should have proper role attributes on messages", async () => {
      element.validationState = "error";
      element.validationMessage = "Error";
      await element.updateComplete;

      const errorMessage = element.shadowRoot?.querySelector(".qgds-validation-message");
      expect(errorMessage?.getAttribute("role")).toBe("alert");
    });
  });

  describe("Disabled state", () => {
    it("should disable native select when disabled", async () => {
      element.disabled = true;
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector("select");
      expect(select?.disabled).toBe(true);
    });

    it("should have disabled property set", async () => {
      element.disabled = true;
      await element.updateComplete;

      expect(element.disabled).toBe(true);
    });
  });

  // describe("Autofocus", () => {
  //   it("should focus native select", async () => {
  //     document.body.removeChild(element);
  //     element.autofocus = true;
  //     document.body.appendChild(element);
  //     await element.updateComplete;
  //     const select = element.shadowRoot?.querySelector("select");
  //     expect(document.activeElement).toBe(select);
  //   });
  // });

  describe("Public methods", () => {
    it("should focus the select element", async () => {
      await element.updateComplete;

      const select = element.shadowRoot?.querySelector<HTMLSelectElement>("select");
      if (!select) throw new Error("Select element not found");

      const focusSpy = vi.spyOn(select, "focus");

      element.focus();

      expect(focusSpy).toHaveBeenCalled();
    });

    it("should get selected values as array", () => {
      element.value = "cat";
      expect(element.getSelectedValues()).toEqual(["cat"]);

      element.multiple = true;
      element.value = "dog,cat,hamster";
      expect(element.getSelectedValues()).toEqual(["dog", "cat", "hamster"]);
    });

    it("should set selected values from array", () => {
      element.multiple = true;
      element.setSelectedValues(["dog", "hamster"]);
      expect(element.value).toBe("dog,hamster");
    });
  });

  describe("Dynamic option updates", () => {
    it("should update native options when custom options are modified", async () => {
      const option1 = document.createElement("qgds-select-option");
      option1.value = "dog";
      option1.label = "Dog";
      element.appendChild(option1);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      let select = element.shadowRoot?.querySelector("select");
      let options = select?.querySelectorAll("option:not([value=''])");
      expect(options?.length).toBe(1);

      // Add another option
      const option2 = document.createElement("qgds-select-option");
      option2.value = "cat";
      option2.label = "Cat";
      element.appendChild(option2);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      select = element.shadowRoot?.querySelector("select");
      options = select?.querySelectorAll("option:not([value=''])");
      expect(options?.length).toBe(2);
    });

    it("should reset value when options no longer contain current value", async () => {
      const option = document.createElement("qgds-select-option");
      option.value = "cat";
      option.label = "Cat";
      element.appendChild(option);
      element.value = "cat";

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Remove the option
      element.removeChild(option);

      await element.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(element.value).toBe("");
    });
  });

  describe("QGDSSelectOption component", () => {
    it("should render with default properties", async () => {
      const option = document.createElement("qgds-select-option");
      document.body.appendChild(option);
      await option.updateComplete;

      expect(option.value).toBe("");
      expect(option.label).toBe("");
      expect(option.disabled).toBe(false);
      expect(option.selected).toBe(false);

      option.remove();
    });

    it("should use label when provided, otherwise value", async () => {
      const option = document.createElement("qgds-select-option");
      option.value = "dog";
      document.body.appendChild(option);
      await option.updateComplete;

      expect(option.getTextContent()).toBe("dog");

      option.label = "Dog";
      await option.updateComplete;

      expect(option.getTextContent()).toBe("Dog");

      option.remove();
    });

    it("should convert to native option element", () => {
      const option = document.createElement("qgds-select-option");
      option.value = "cat";
      option.label = "Cat";
      option.disabled = true;
      option.selected = true;

      const nativeOption = option.toNativeOption();

      expect(nativeOption.value).toBe("cat");
      expect(nativeOption.textContent).toBe("Cat");
      expect(nativeOption.disabled).toBe(true);
      expect(nativeOption.selected).toBe(true);
    });
  });

  describe("QGDSSelectOptgroup component", () => {
    it("should render with label", async () => {
      const optgroup = document.createElement("qgds-select-optgroup");
      optgroup.label = "Pets";
      document.body.appendChild(optgroup);
      await optgroup.updateComplete;

      expect(optgroup.label).toBe("Pets");

      optgroup.remove();
    });

    it("should convert to native optgroup with options", async () => {
      const optgroup = document.createElement("qgds-select-optgroup");
      optgroup.label = "Pets";

      const option1 = document.createElement("qgds-select-option");
      option1.value = "dog";
      option1.label = "Dog";

      const option2 = document.createElement("qgds-select-option");
      option2.value = "cat";
      option2.label = "Cat";

      optgroup.appendChild(option1);
      optgroup.appendChild(option2);

      document.body.appendChild(optgroup);
      await optgroup.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      const nativeOptgroup = optgroup.toNativeOptgroup();

      expect(nativeOptgroup.label).toBe("Pets");
      expect(nativeOptgroup.children.length).toBe(2);
      expect((nativeOptgroup.children[0] as HTMLOptionElement).value).toBe("dog");
      expect((nativeOptgroup.children[1] as HTMLOptionElement).value).toBe("cat");

      optgroup.remove();
    });

    it("should warn about invalid child elements", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn");

      const optgroup = document.createElement("qgds-select-optgroup");
      optgroup.label = "Group";

      const invalidDiv = document.createElement("div");
      optgroup.appendChild(invalidDiv);

      document.body.appendChild(optgroup);
      await optgroup.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("qgds-select-optgroup only accepts qgds-select-option elements"),
        expect.any(Array)
      );

      consoleWarnSpy.mockRestore();
      optgroup.remove();
    });
  });
});
