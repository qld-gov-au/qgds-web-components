type DataPayload = Record<string, unknown>;

/**
 * Sanitise payload values for analytics (window.dataLayer).
 * - Converts Event to event type string
 * - Converts Element to tag name string
 * - Removes function values
 * - Recursively sanitises arrays/objects
 * - Replaces circular references with a marker
 */

export function sanitisePayload(payload: DataPayload): DataPayload {
  const SKIP = Symbol("skip-value");
  const seen = new WeakSet<object>();

  const sanitiseValue = (value: unknown) => {
    if (value instanceof Event) {
      return value.type;
    }
    if (value instanceof Element) {
      return value.localName;
    }
    if (typeof value === "function") {
      return SKIP;
    }
    if (value === null || typeof value !== "object") {
      return value;
    }

    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);

    if (Array.isArray(value)) {
      const sanitisedArray: unknown[] = [];
      value.forEach((item) => {
        const sanitisedItem = sanitiseValue(item);
        if (sanitisedItem !== SKIP) {
          sanitisedArray.push(sanitisedItem);
        }
      });
      return sanitisedArray;
    }

    const sanitisedObject: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(
      ([key, nestedValue]) => {
        const sanitisedNestedValue = sanitiseValue(nestedValue);
        if (sanitisedNestedValue !== SKIP) {
          sanitisedObject[key] = sanitisedNestedValue;
        }
      },
    );
    return sanitisedObject;
  };

  const sanitisedPayload: DataPayload = {};
  Object.entries(payload).forEach(([key, value]) => {
    const sanitisedValue = sanitiseValue(value);
    if (sanitisedValue !== SKIP) {
      sanitisedPayload[key] = sanitisedValue;
    }
  });

  return sanitisedPayload;
}
