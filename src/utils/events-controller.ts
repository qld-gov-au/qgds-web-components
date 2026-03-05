// events-controller.ts
import type { ReactiveController, ReactiveControllerHost } from "lit";

type EventPayload = Record<string, unknown>;

type EventHost = ReactiveControllerHost & EventTarget;

interface QgdsEventsOptions {
  prefix?: string;
  includeTimestamp?: boolean;
  pushToDataLayer?: boolean;
}

interface EmitOptions {
  bubbles?: boolean;
  composed?: boolean;
  cancelable?: boolean;
}

/**
 * Lightweight central event dispatcher for QGDS components.
 *
 * Usage:
 * const events = new QgdsEvents(this);
 * events.select("next", event);
 */
export class QgdsEvents implements ReactiveController {
  private host: EventHost;
  private prefix: string;
  private includeTimestamp: boolean;
  private pushToDataLayer: boolean;

  constructor(host: EventHost, options: QgdsEventsOptions = {}) {
    this.host = host;
    this.prefix = options.prefix ?? "qgds";
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.pushToDataLayer = options.pushToDataLayer ?? true;
    this.host.addController(this);
  }

  hostConnected(): void {
    // Intentionally minimal for the initial controller foundation.
    void this.host;
  }

  hostDisconnected(): void {
    // Placeholder for future cleanup/subscription logic.
    void this.host;
  }

  emit(name: string, detail: EventPayload = {}, options: EmitOptions = {}): boolean {
    const eventName = this.toEventName(name);
    const payload = this.withTimestamp(detail);
    this.pushAnalyticsEvent(eventName, payload);

    return this.host.dispatchEvent(
      new CustomEvent(eventName, {
        detail: payload,
        bubbles: options.bubbles ?? true,
        composed: options.composed ?? true,
        cancelable: options.cancelable ?? false,
      }),
    );
  }

  // Semantic API for common UI interactions.
  select(id: string, originalEvent: Event): boolean {
    return this.emit("select", { id, originalEvent });
  }

  change(value: unknown, originalEvent?: Event): boolean {
    return this.emit("change", { value, originalEvent });
  }

  toggle(open: boolean, originalEvent?: Event): boolean {
    return this.emit("toggle", { open, originalEvent });
  }

  error(message: string, originalEvent?: Event): boolean {
    return this.emit("error", { message, originalEvent });
  }

  private toEventName(name: string): string {
    const cleanName = name.trim();
    if (!cleanName) {
      throw new Error("QgdsEvents.emit: event name must not be empty.");
    }
    return `${this.prefix}-${cleanName}`;
  }

  private withTimestamp(detail: EventPayload): EventPayload {
    if (!this.includeTimestamp) {
      return detail;
    }
    return {
      ...detail,
      timestamp: Date.now(),
    };
  }

  private pushAnalyticsEvent(eventName: string, payload: EventPayload): void {
    if (!this.pushToDataLayer || typeof window === "undefined") {
      return;
    }

    const dataLayer = (window.dataLayer ??= []);
    if (!Array.isArray(dataLayer)) {
      return;
    }

    dataLayer.push({
      event: eventName,
      ...this.sanitizeForAnalytics(payload),
    });
  }

  private sanitizeForAnalytics(payload: EventPayload): EventPayload {
    const sanitized: EventPayload = {};

    Object.entries(payload).forEach(([key, value]) => {
      if (value instanceof Event) {
        sanitized[key] = value.type;
        return;
      }
      if (value instanceof Element) {
        sanitized[key] = value.localName;
        return;
      }
      if (typeof value === "function") {
        return;
      }
      sanitized[key] = value;
    });

    return sanitized;
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
