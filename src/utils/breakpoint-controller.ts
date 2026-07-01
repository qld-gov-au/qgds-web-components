import { ReactiveController, ReactiveControllerHost } from "lit";
import qgdsBreakpoint from "../styles/qgds-tokens/qgds-breakpoint";

type BreakpointKey = keyof typeof qgdsBreakpoint;

export class BreakpointController implements ReactiveController {
  private host: ReactiveControllerHost;
  private queries: { key: BreakpointKey; mql: MediaQueryList }[] = [];

  // Expose the active breakpoint string
  current: BreakpointKey = "XS";

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);

    // reverse order so match returns the largest bp first
    const definitions: { key: BreakpointKey; query: string }[] = [
      { key: "XXL", query: `(width >= ${qgdsBreakpoint.XXL}px)` },
      { key: "XL", query: `(width >= ${qgdsBreakpoint.XL}px)` },
      { key: "LG", query: `(width >= ${qgdsBreakpoint.LG}px)` },
      { key: "MD", query: `(width >= ${qgdsBreakpoint.MD}px)` },
      { key: "SM", query: `(width >= ${qgdsBreakpoint.SM}px)` },
      { key: "XS", query: `(width < ${qgdsBreakpoint.SM}px)` },
    ];

    this.queries = definitions.map(({ key, query }) => ({
      key,
      mql: window.matchMedia(query),
    }));

    this.updateActiveBreakpoint();
  }

  hostConnected() {
    this.queries.forEach(({ mql }) => {
      mql.addEventListener("change", this.updateActiveBreakpoint);
    });
  }

  hostDisconnected() {
    this.queries.forEach(({ mql }) => {
      mql.removeEventListener("change", this.updateActiveBreakpoint);
    });
  }

  private updateActiveBreakpoint = () => {
    const active = this.queries.find(({ mql }) => mql.matches);
    if (active) {
      this.current = active.key;
      this.host.requestUpdate();
    }
  };
}
