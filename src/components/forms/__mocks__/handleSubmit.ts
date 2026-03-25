import { action } from "storybook/actions";

export const handleServerSideValidationSubmit = (e: SubmitEvent) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const entries = Array.from(formData.entries());
  console.log(entries);
  //   const data = Array.from(formData.keys()).reduce(
  //     (acc, key) => {
  //       const values = formData.getAll(key);
  //       acc[key] = values.length > 1 ? values : values[0];
  //       return acc;
  //     },
  //     {} as Record<string, FormDataEntryValue | FormDataEntryValue[]>
  //   );
};
