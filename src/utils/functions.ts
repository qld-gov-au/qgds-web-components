// QGDS Common Functions

export default function() {
  // Write a function that listens for a bubbled event from within the qgds-alert component.
  // The element that triggers the event is a <button> inside the component.
  // document.querySelector("qgds-inpage-alert")?.addEventListener("click", (e) => {
  //   const path = e.composedPath();
  //   const clickedButton = path.find(
  //     (el) => el instanceof HTMLButtonElement && el.dataset.id
  //   );
  //   if (clickedButton) {
  //     console.log(
  //       `Clicked button: ${clickedButton.dataset.id} on path ${path
  //         .map((el) => el.tagName)
  //         .join(" > ")}`
  //     );
  //     // e.g. "save", "cancel", "delete"
  //   }
  // });
}
