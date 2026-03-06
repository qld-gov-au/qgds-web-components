/** * QGDS Event API Methods
 * * Provides a standardized set of methods for dispatching common events.
 * All methods follow a consistent signature: (payload, originalEvent).
 */

type EventPayload = Record<string, unknown>;

interface EventEmitter {
  emit(name: string, detail?: EventPayload): boolean;
}

export class QgdsEventApi {
  /**
   * @param {EventEmitter} emitter - An object that implements the EventEmitter interface (typically QgdsEvents).
   */
  constructor(private readonly emitter: EventEmitter) {}

  /**
   * Internal helper to standardize the dispatch logic and satisfy DRY.
   */
  private dispatch(
    name: string,
    detail: EventPayload = {},
    originalEvent?: Event,
  ): boolean {
    return this.emitter.emit(name, { ...detail, originalEvent });
  }

  // --- Semantic API Methods ---
  // All methods now accept a flexible payload and an optional original event.
  // These are separated into individual methods for future extensibility, but they all currently use the same dispatch logic.

  select = (detail: EventPayload, ev?: Event) =>
    this.dispatch("select", detail, ev);

  change = (detail: EventPayload, ev?: Event) =>
    this.dispatch("change", detail, ev);

  toggle = (detail: EventPayload, ev?: Event) =>
    this.dispatch("toggle", detail, ev);

  error = (detail: EventPayload, ev?: Event) =>
    this.dispatch("error", detail, ev);

  open = (detail: EventPayload, ev?: Event) =>
    this.dispatch("open", detail, ev);

  close = (detail: EventPayload, ev?: Event) =>
    this.dispatch("close", detail, ev);

  expand = (detail: EventPayload, ev?: Event) =>
    this.dispatch("expand", detail, ev);

  collapse = (detail: EventPayload, ev?: Event) =>
    this.dispatch("collapse", detail, ev);

  input = (detail: EventPayload, ev?: Event) =>
    this.dispatch("input", detail, ev);

  submit = (detail: EventPayload, ev?: Event) =>
    this.dispatch("submit", detail, ev);

  cancel = (detail: EventPayload, ev?: Event) =>
    this.dispatch("cancel", detail, ev);

  reset = (detail: EventPayload, ev?: Event) =>
    this.dispatch("reset", detail, ev);

  navigate = (detail: EventPayload, ev?: Event) =>
    this.dispatch("navigate", detail, ev);

  activate = (detail: EventPayload, ev?: Event) =>
    this.dispatch("activate", detail, ev);

  deactivate = (detail: EventPayload, ev?: Event) =>
    this.dispatch("deactivate", detail, ev);

  focus = (detail: EventPayload, ev?: Event) =>
    this.dispatch("focus", detail, ev);

  blur = (detail: EventPayload, ev?: Event) =>
    this.dispatch("blur", detail, ev);

  dismiss = (detail: EventPayload, ev?: Event) =>
    this.dispatch("dismiss", detail, ev);

  load = (detail: EventPayload, ev?: Event) =>
    this.dispatch("load", detail, ev);

  ready = (detail: EventPayload, ev?: Event) =>
    this.dispatch("ready", detail, ev);

  success = (detail: EventPayload, ev?: Event) =>
    this.dispatch("success", detail, ev);

  failure = (detail: EventPayload, ev?: Event) =>
    this.dispatch("failure", detail, ev);
}
