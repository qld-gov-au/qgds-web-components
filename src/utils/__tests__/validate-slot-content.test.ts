import { describe, expect, it } from "vitest";
import { scrubSlotContent } from "../scrub-slot-content";

type NodeInput = Node | string;

function createSlotHost(children: NodeInput[]) {
  const host = document.createElement("div");
  const shadowRoot = host.attachShadow({ mode: "open" });
  const slot = document.createElement("slot");
  shadowRoot.appendChild(slot);

  children.forEach((child) => {
    if (typeof child === "string") {
      host.appendChild(document.createTextNode(child));
    } else {
      host.appendChild(child);
    }
  });

  document.body.appendChild(host);
  return { host, slot };
}

describe("validateSlotContent", () => {
  it("allows text nodes when allowTextNodes is true", () => {
    const { host, slot } = createSlotHost(["hello world"]);
    const result = scrubSlotContent(slot, undefined, false, true);

    expect(result).toBe(true);
    expect(host.childNodes.length).toBe(1);
    expect(host.textContent).toBe("hello world");

    host.remove();
  });

  it("removes text nodes when allowTextNodes is false", () => {
    const { host, slot } = createSlotHost(["hello world"]);
    const result = scrubSlotContent(slot, undefined, false, false);

    expect(result).toBe(false);
    expect(host.childNodes.length).toBe(0);

    host.remove();
  });

  it("allows any number of elements matching a single validElements string", () => {
    const validElement1 = document.createElement("qgds-link");
    const validElement2 = document.createElement("qgds-link");
    const invalidElement = document.createElement("p");
    const { host, slot } = createSlotHost([validElement1, validElement2, invalidElement]);

    const result = scrubSlotContent(slot, "qgds-link");

    expect(result).toBe(false);
    expect(host.querySelectorAll("qgds-link").length).toBe(2);
    expect(host.querySelector("p")).toBeNull();

    host.remove();
  });

  it("allows multiple valid element names from an array", () => {
    const validDiv = document.createElement("div");
    const validSpan = document.createElement("span");
    const invalidElement = document.createElement("p");
    const { host, slot } = createSlotHost([validDiv, validSpan, invalidElement]);

    const result = scrubSlotContent(slot, ["div", "span"]);

    expect(result).toBe(false);
    expect(host.querySelectorAll("div, span").length).toBe(2);
    expect(host.querySelector("p")).toBeNull();

    host.remove();
  });

  it("enforces maximum counts for record-based validElements and allows -1 as unlimited", () => {
    const allowedOne = document.createElement("qgds-link");
    const allowedTwo = document.createElement("qgds-link");
    const unlimitedOne = document.createElement("qgds-link-item");
    const unlimitedTwo = document.createElement("qgds-link-item");
    const invalidElement = document.createElement("p");
    const { host, slot } = createSlotHost([allowedOne, allowedTwo, unlimitedOne, unlimitedTwo, invalidElement]);

    const result = scrubSlotContent(slot, { "qgds-link": 1, "qgds-link-item": -1 });

    expect(result).toBe(false);
    expect(host.querySelectorAll("qgds-link").length).toBe(1);
    expect(host.querySelectorAll("qgds-link-item").length).toBe(2);
    expect(host.querySelector("p")).toBeNull();

    host.remove();
  });
});
