import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "./qgds-table";
import type { QGDSTable } from "./qgds-table";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeTable({
  withCaption = true,
  withThead = true,
  withTh = true,
  rows = 3,
  cols = 3,
}: {
  withCaption?: boolean;
  withThead?: boolean;
  withTh?: boolean;
  rows?: number;
  cols?: number;
} = {}): HTMLTableElement {
  const table = document.createElement("table");
  if (withCaption) {
    const cap = document.createElement("caption");
    cap.textContent = "Test caption";
    table.appendChild(cap);
  }
  if (withThead) {
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    for (let c = 0; c < cols; c++) {
      if (withTh) {
        const th = document.createElement("th");
        th.setAttribute("scope", "col");
        th.textContent = `Header ${c + 1}`;
        tr.appendChild(th);
      }
    }
    thead.appendChild(tr);
    table.appendChild(thead);
  }
  const tbody = document.createElement("tbody");
  for (let r = 0; r < rows; r++) {
    const tr = document.createElement("tr");
    for (let c = 0; c < cols; c++) {
      const td = document.createElement("td");
      td.textContent = `R${r + 1}C${c + 1}`;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
}

async function slotTable(element: QGDSTable, table: HTMLTableElement): Promise<void> {
  element.appendChild(table);
  await element.updateComplete;
  // Allow microtask for slotchange to fire
  await new Promise<void>((r) => setTimeout(r, 0));
}

/**
 * Creates a minimal MediaQueryList stub.
 * `initialMatches = true`  → simulate mobile  (<= 699 px)
 * `initialMatches = false` → simulate desktop (>  699 px)
 *
 * Call `instance._simulate(bool)` to fire the "change" listener
 * exactly as the real MQL would when the viewport crosses the breakpoint.
 */
function createMockMql(initialMatches: boolean) {
  const listeners: ((e: MediaQueryListEvent) => void)[] = [];
  const mql = {
    matches: initialMatches,
    media: "(width <= 699px)",
    addEventListener(_type: string, fn: (e: MediaQueryListEvent) => void) {
      listeners.push(fn);
    },
    removeEventListener(_type: string, fn: (e: MediaQueryListEvent) => void) {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    },
    dispatchEvent: () => true,
    /** Simulate the viewport crossing the breakpoint. */
    _simulate(newMatches: boolean) {
      mql.matches = newMatches;
      const evt = Object.assign(new Event("change"), { matches: newMatches }) as MediaQueryListEvent;
      listeners.forEach((fn) => fn(evt));
    },
  };
  return mql;
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe("qgds-table", () => {
  let element: QGDSTable;
  let mockMql: ReturnType<typeof createMockMql>;

  beforeEach(() => {
    // Simulate mobile by default so _applyStackLabels does not bail early.
    mockMql = createMockMql(true);
    vi.stubGlobal("matchMedia", () => mockMql);
    element = document.createElement("qgds-table");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // ── Default property values ───────────────────────────────────────────────

  it("has responsive defaulting to scroll", async () => {
    await element.updateComplete;
    expect(element.responsive).toBe("scroll");
  });

  it("has isStriped defaulting to false", async () => {
    await element.updateComplete;
    expect(element.isStriped).toBe(false);
  });

  it("has isHovered defaulting to false", async () => {
    await element.updateComplete;
    expect(element.isHovered).toBe(false);
  });

  it("has hasBorder defaulting to false", async () => {
    await element.updateComplete;
    expect(element.hasBorder).toBe(false);
  });

  it("has hasStickyHeader defaulting to false", async () => {
    await element.updateComplete;
    expect(element.hasStickyHeader).toBe(false);
  });

  // ── Shadow DOM structure ──────────────────────────────────────────────────

  it("renders a .table-wrapper div", async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".table-wrapper")).toBeTruthy();
  });

  it("renders a slot inside the wrapper", async () => {
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector("slot")).toBeTruthy();
  });

  // ── responsive="scroll" wrapper behaviour ────────────────────────────────

  it("adds is-scroll class when responsive is scroll (default)", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.classList.contains("is-scroll")).toBe(true);
  });

  it("sets tabindex=0 on wrapper when responsive is scroll", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.getAttribute("tabindex")).toBe("0");
  });

  it("sets role=region on wrapper when responsive is scroll", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.getAttribute("role")).toBe("region");
  });

  // ── responsive="stack" wrapper behaviour ─────────────────────────────────

  it("adds is-stack class when responsive is stack", async () => {
    element.responsive = "stack";
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.classList.contains("is-stack")).toBe(true);
  });

  it("does not set tabindex on wrapper when responsive is stack", async () => {
    element.responsive = "stack";
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.hasAttribute("tabindex")).toBe(false);
  });

  it("does not set role on wrapper when responsive is stack", async () => {
    element.responsive = "stack";
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector(".table-wrapper");
    expect(wrapper?.hasAttribute("role")).toBe(false);
  });

  // ── Attribute reflection ──────────────────────────────────────────────────

  it("reflects responsive attribute", async () => {
    element.setAttribute("responsive", "stack");
    await element.updateComplete;
    expect(element.responsive).toBe("stack");
  });

  it("reflects is-striped boolean attribute", async () => {
    element.setAttribute("is-striped", "");
    await element.updateComplete;
    expect(element.isStriped).toBe(true);
  });

  it("reflects is-hovered boolean attribute", async () => {
    element.setAttribute("is-hovered", "");
    await element.updateComplete;
    expect(element.isHovered).toBe(true);
  });

  it("reflects has-border boolean attribute", async () => {
    element.setAttribute("has-border", "");
    await element.updateComplete;
    expect(element.hasBorder).toBe(true);
  });

  it("reflects has-sticky-header boolean attribute", async () => {
    element.setAttribute("has-sticky-header", "");
    await element.updateComplete;
    expect(element.hasStickyHeader).toBe(true);
  });

  // ── Table DOM integrity (no mutation) ─────────────────────────────────────

  it("does not add classes to the slotted table", async () => {
    const table = makeTable();
    const originalClasses = table.className;
    await slotTable(element, table);
    expect(table.className).toBe(originalClasses);
  });

  it("does not alter row or cell count", async () => {
    const table = makeTable({ rows: 3, cols: 3 });
    await slotTable(element, table);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(3);
    expect(table.querySelectorAll("tbody td")).toHaveLength(9);
  });

  it("does not change the text content of any cell", async () => {
    const table = makeTable({ rows: 2, cols: 2 });
    const cellTexts = Array.from(table.querySelectorAll("td")).map((td) => td.textContent);
    await slotTable(element, table);
    const afterTexts = Array.from(table.querySelectorAll("td")).map((td) => td.textContent);
    expect(afterTexts).toEqual(cellTexts);
  });

  // ── Stack mode: data-label injection ─────────────────────────────────────

  it("adds data-label attributes to td cells in stack mode", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);
    const firstRowCells = table.querySelectorAll("tbody tr:first-child td");
    expect(firstRowCells[0].getAttribute("data-label")).toBe("Header 1");
    expect(firstRowCells[1].getAttribute("data-label")).toBe("Header 2");
    expect(firstRowCells[2].getAttribute("data-label")).toBe("Header 3");
  });

  it("does not add data-label attributes in scroll mode", async () => {
    element.responsive = "scroll";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);
    const cells = table.querySelectorAll("tbody td");
    cells.forEach((cell) => {
      expect(cell.hasAttribute("data-label")).toBe(false);
    });
  });

  // ── Stack mode: label lifecycle ───────────────────────────────────────────

  it("clears data-label attributes when switching from stack to scroll", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);
    expect(table.querySelector("tbody td")?.getAttribute("data-label")).toBe("Header 1");

    element.responsive = "scroll";
    await element.updateComplete;

    table.querySelectorAll("tbody td").forEach((cell) => {
      expect(cell.hasAttribute("data-label")).toBe(false);
    });
  });

  it("re-applies data-label attributes when switching back to stack", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);

    element.responsive = "scroll";
    await element.updateComplete;

    element.responsive = "stack";
    await element.updateComplete;

    expect(table.querySelector("tbody tr:first-child td")?.getAttribute("data-label")).toBe("Header 1");
  });

  it("skips applying data-label when viewport is desktop (mql.matches = false)", async () => {
    // Slot in scroll mode first so _setupMediaQuery is called (with the desktop
    // mock) before we switch to stack. That ensures this._mql is set and has
    // matches=false when _applyStackLabels is invoked from updated().
    mockMql = createMockMql(false); // simulate desktop
    element.responsive = "scroll";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);

    element.responsive = "stack";
    await element.updateComplete;

    table.querySelectorAll("tbody td").forEach((cell) => {
      expect(cell.hasAttribute("data-label")).toBe(false);
    });
  });

  it("clears data-label when viewport crosses to desktop", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);
    expect(table.querySelector("tbody td")?.getAttribute("data-label")).toBe("Header 1");

    mockMql._simulate(false); // cross to desktop

    table.querySelectorAll("tbody td").forEach((cell) => {
      expect(cell.hasAttribute("data-label")).toBe(false);
    });
  });

  it("re-applies data-label when viewport crosses back to mobile", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);

    mockMql._simulate(false); // cross to desktop — clears labels
    mockMql._simulate(true); // cross back to mobile — re-applies

    expect(table.querySelector("tbody tr:first-child td")?.getAttribute("data-label")).toBe("Header 1");
  });

  // ── Stack mode: MutationObserver header sync ──────────────────────────────

  it("re-syncs data-label when a header cell text changes", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);

    const th = table.querySelector("thead tr:first-child th");
    if (th) th.textContent = "Renamed Header";

    // Allow MutationObserver callback to fire
    await new Promise<void>((r) => setTimeout(r, 0));

    expect(table.querySelector("tbody tr:first-child td")?.getAttribute("data-label")).toBe("Renamed Header");
  });

  it("removes data-label from cells that no longer have a matching header", async () => {
    element.responsive = "stack";
    const table = makeTable({ rows: 2, cols: 3 });
    await slotTable(element, table);

    table.querySelector("thead tr:first-child th:last-child")?.remove();

    await new Promise<void>((r) => setTimeout(r, 0));

    const lastCell = table.querySelector("tbody tr:first-child td:last-child");
    expect(lastCell?.hasAttribute("data-label")).toBe(false);
  });

  // ── Accessibility validation warnings ────────────────────────────────────

  it("warns when slotted table has no <caption>", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const table = makeTable({ withCaption: false });
    await slotTable(element, table);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("<caption>"));
  });

  it("warns when slotted table has no <thead>", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const table = makeTable({ withThead: false });
    await slotTable(element, table);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("<thead>"));
  });

  it("warns when slotted table has no <th> elements", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const table = makeTable({ withTh: false });
    await slotTable(element, table);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("<th>"));
  });

  it("warns when no <table> is slotted", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const div = document.createElement("div");
    element.appendChild(div);
    await element.updateComplete;
    await new Promise<void>((r) => setTimeout(r, 0));
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("No <table>"));
  });

  it("does not warn when table has all required accessibility elements", async () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(vi.fn());
    const table = makeTable();
    await slotTable(element, table);
    expect(spy).not.toHaveBeenCalled();
  });

  // ── Keyboard navigation (scroll mode) ────────────────────────────────────

  it("scrolls right on ArrowRight key", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector<HTMLElement>(".table-wrapper");
    if (!wrapper) return;
    // jsdom doesn't implement scrollLeft setters, so just verify the handler
    // fires without error and preventDefault is called
    const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    wrapper.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it("scrolls left on ArrowLeft key", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector<HTMLElement>(".table-wrapper");
    if (!wrapper) return;
    const event = new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    wrapper.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });

  it("scrolls right on Space key", async () => {
    await element.updateComplete;
    const wrapper = element.shadowRoot?.querySelector<HTMLElement>(".table-wrapper");
    if (!wrapper) return;
    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true });
    const preventSpy = vi.spyOn(event, "preventDefault");
    wrapper.dispatchEvent(event);
    expect(preventSpy).toHaveBeenCalled();
  });
});
