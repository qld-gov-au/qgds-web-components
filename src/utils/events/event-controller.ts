/**
 * QGDS Events Controller
 * A lightweight central event dispatcher for QGDS components, built as a Lit ReactiveController.
 *
 * This controller provides a dual-layered approach to event handling:
 * 1. **Semantic API (Recommended)**: Accessible via `this.events.api`, providing standardized methods
 * (e.g., `select`, `Maps`, `toggle`) with consistent payload structures.
 * 2. **Low-level Dispatcher**: A flexible `emit` method for custom requirements.
 *
 * Features:
 * - **Auto-prefixing**: Prefixes event names (default: "qgds-").
 * - **Standardized Payloads**: Automatically attaches timestamps and handles analytics sanitization.
 * - **Analytics Integration**: Optional automatic pushing to `window.dataLayer`.
 *
 * @example
 * // Initialization
 * events = new QgdsEvents(this);
 *
 * // High-level API usage
 * this.events.api.select("event-name", originalEvent, { custom: "data" });
 *
 * // Low-level escape hatch
 * this.events.emit("custom-action", { custom: "data" });
 *
 * @param host - The component host (must be an Element and ReactiveControllerHost).
 * @param options - Configuration for prefixing, timestamps, and dataLayer integration.
 */

import type { ReactiveController, ReactiveControllerHost } from "lit";
import { QgdsEventApi } from "./event-apis";

// Generic event payload type
type EventPayload = Record<string, unknown>;

// Host must be both a ReactiveControllerHost (to use as a Lit controller) and an EventTarget (to dispatch events)
type EventHost = ReactiveControllerHost & EventTarget;

// Settable options when creating a QgdsEvents instance
interface QgdsEventsOptions {
  prefix?: string;
  includeTimestamp?: boolean;
  pushToDataLayer?: boolean;
}

// Standard options to apply to a CustomEvent dispatch
interface EmitOptions {
  bubbles?: boolean;
  composed?: boolean;
  cancelable?: boolean;
}

// QgdsEvents Class Definition
export class QgdsEvents implements ReactiveController {
  private host: EventHost;
  private prefix: string;
  private includeTimestamp: boolean;
  private pushToDataLayer: boolean;
  readonly api: QgdsEventApi;

  constructor(host: EventHost, options: QgdsEventsOptions = {}) {
    this.host = host;
    this.prefix = options.prefix ?? "qgds";
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.pushToDataLayer = options.pushToDataLayer ?? false;
    this.api = new QgdsEventApi(this);
    this.host.addController(this);
  }

  hostConnected(): void {
    // Placeholder for future logic.
    void this.host;
  }

  hostDisconnected(): void {
    // Placeholder for future logic.
    void this.host;
  }

  emit(
    name: string,
    detail: EventPayload = {},
    options: EmitOptions = {},
  ): boolean {
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

  /**
   * Returns all host attributes as a plain object map.
   * Useful for attaching host metadata to emitted event payloads.
   */
  getHostAttributes(): Record<string, string | null> {
    if (!(this.host instanceof Element)) {
      return {};
    }

    const element = this.host as Element;
    return Object.fromEntries(
      element
        .getAttributeNames()
        .map((name) => [name, element.getAttribute(name)]),
    );
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
    const sanitised: EventPayload = {};

    Object.entries(payload).forEach(([key, value]) => {
      if (value instanceof Event) {
        sanitised[key] = value.type;
        return;
      }
      if (value instanceof Element) {
        sanitised[key] = value.localName;
        return;
      }
      if (typeof value === "function") {
        return;
      }
      sanitised[key] = value;
    });

    return sanitised;
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
