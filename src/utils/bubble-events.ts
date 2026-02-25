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

interface OptionsType{
  bubbles?: boolean;
  composed?: boolean;
  cancelable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  detail?: any;
};

/**
 * Bubbles specified events from sourceEl to targetEl.
 * @param {Element} sourceEl
 * @param {Element} targetEl
 * @param {string[]} events
 * @returns {Function} cleanup function to remove listeners
 */
export function bubbleAllEvents(
  sourceEl: Element,
  targetEl: Element,
  events = defaultEvents
) {
  const handler = (event: Event) => {
    // Only include detail for CustomEvent
    const options: OptionsType = {
      bubbles: true,
      composed: true,
      cancelable: event.cancelable,
    };
    if (event instanceof CustomEvent) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options.detail = event.detail;
    }
    targetEl.dispatchEvent(new Event(event.type, options));
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
