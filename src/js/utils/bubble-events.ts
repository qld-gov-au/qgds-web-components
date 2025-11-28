export const defaultEvents = [
  "click",
  "focus",
  "blur",
  "input",
  "change",
  "keydown",
  "keyup",
  "mouseenter",
  "mouseleave",
  "submit",
  "reset",
  "sl-input",
  "sl-change",
];

/**
 * Bubbles specified events from sourceEl to targetEl.
 * @param {Element} sourceEl
 * @param {Element} targetEl
 * @param {string[]} events
 * @returns {Function} cleanup function to remove listeners
 */
export function bubbleAllEvents(sourceEl, targetEl, events = defaultEvents) {
  const handler = (event) => {
    // Only include detail for CustomEvent
    const options = {
      bubbles: true,
      composed: true,
      cancelable: event.cancelable,
    };
    if (event instanceof CustomEvent) {
      options.detail = event.detail;
    }
    targetEl.dispatchEvent(new event.constructor(event.type, options));
  };

  for (const type of events) {
    sourceEl.addEventListener(type, handler);
  }

  // Return cleanup function
  return () => {
    for (const type of events) {
      sourceEl.removeEventListener(type, handler);
    }
  };
}
