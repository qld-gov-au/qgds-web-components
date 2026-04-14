/**
 * QGDS Events Controller
 
 * A lightweight central event dispatcher for QGDS components. This controller provides a typed low-level dispatcher for standardised event names.
 *
 * @example
 * // Initialisation
 * events = new QgdsEvents(this);
 *
 * // Example with detail payload
 * this.events.dispatch("toggle", { open: true }, originalEvent);
 *
 * @param host - The component host element.
 * @param options - Configuration for prefixing and timestamps.
*/

type EventPayload = Record<string, unknown>;

export const EventNames = [
  "click",
  "select",
  "change",
  "toggle",
  "error",
  "open",
  "close",
  "expand",
  "collapse",
  "input",
  "submit",
  "cancel",
  "reset",
  "navigate",
  "activate",
  "deactivate",
  "focus",
  "blur",
  "dismiss",
  "load",
  "ready",
  "success",
  "failure",
  "search",
] as const;

export type QgdsControlledEventName = (typeof EventNames)[number];

// Host must be an element to support metadata and event dispatch.
type EventHost = HTMLElement;

interface QgdsEventsOptions {
  prefix?: string;
  includeTimestamp?: boolean;
}

export class QgdsEvents {
  private host: EventHost;
  private prefix: string;
  private includeTimestamp: boolean;

  constructor(host: EventHost, options: QgdsEventsOptions = {}) {
    this.host = host;
    // Default to 'qgds' and ensure we handle the hyphen consistently
    this.prefix = options.prefix ?? "qgds";
    this.includeTimestamp = options.includeTimestamp ?? true;
  }

  /**
   * Create a custom event with standardized metadata and options.
   * @param name - The event name from the controlled event names set
   * @param detail - Optional detail payload to include in the event
   * @param originalEvent - Optional original event that triggered this event
   * @returns A CustomEvent object
   */
  create(name: QgdsControlledEventName, detail: EventPayload = {}, originalEvent?: Event): CustomEvent {
    // Adds prefix and ensures event name is valid
    const eventName = this.toEventName(name);

    // Merge metadata, details, and timestamp
    const payload: EventPayload = {
      component: this.host.localName,
      componentID: this.host.id || null,
      ...detail,
      ...(this.includeTimestamp ? { timestamp: Date.now() } : {}),
      originalEvent,
    };

    return new CustomEvent(eventName, {
      detail: payload,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
  }

  /**
   * Dispatch a custom event using a controlled event name set or dispatch an already created CustomEvent.
   * @overload
   * dispatch(name: QgdsControlledEventName, detail?: EventPayload, originalEvent?: Event): boolean
   * @overload
   * dispatch(event: CustomEvent): boolean
   */
  dispatch(nameOrEvent: QgdsControlledEventName | CustomEvent, detail?: EventPayload, originalEvent?: Event): boolean {
    let event: CustomEvent;

    if (nameOrEvent instanceof CustomEvent) {
      event = nameOrEvent;
    } else {
      event = this.create(nameOrEvent, detail, originalEvent);
    }

    return this.host.dispatchEvent(event);
  }

  /* Tidy up event names and apply prefix */
  private toEventName(name: string): string {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error("QgdsEvents.dispatch: event name must not be empty.");
    }
    return `${this.prefix}-${cleanName}`;
  }
}
