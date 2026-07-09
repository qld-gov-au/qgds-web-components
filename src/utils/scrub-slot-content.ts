/**
 * Validate and remove any assigned nodes from a HTML Slot element. Returns true if all nodes pass validation, false if any invalid.
 * Apply within a slotchange event handler for best results.
 * @param {HTMLSlotElement} slot - The slot to validate
 * @param {string | string[] | Record<string, number>} validElements - A single string or Array of strings representing a HTML tags, or an object of any number of {tagName: maxNumber}.
 * @param {boolean} [flatten=false] - Set to true to additionally check all decendant child nodes of assigned elements. If true, allowTextNodes should be true.
 * @param {boolean} [allowTextNodes=false]  Set to true to allow plain text nodes. Should be true if flatten is true.
 * @returns {boolean} true if nodes pass validation, false if invalid
 *
 * @example
 * // Validate the slot content
 * private _handleSlotChange = (e: Event): void => {
 *  const slot = e.target as HTMLSlotElement;
 *
 *  // Allow any number of single element type "qgds-link"
 *  validateSlotContent(slot, "qgds-link");
 *
 *  // Allow only one "qgds-link" element
 *  validateSlotContent(slot, { "qgds-link": 1 });
 *
 *  // Allow 3 "qgds-link", but unlimited "qgds-link-item"
 *  validateSlotContent(slot, { "qgds-link": 3, "qgds-link-item": -1 });
 *
 *  Allow only text nodes
 *  validateSlotContent(slot, null, null, true);
 * }
 *
 * render() => html`<slot @slotchange={this._handleSlotChange} ></slot>`
 *
 *
 */
export function scrubSlotContent(
  slot: HTMLSlotElement,
  validElements?: string | string[] | Record<string, number>,
  flatten = false,
  allowTextNodes = false
): boolean {
  let valid: boolean = true;
  const nodes = slot.assignedNodes({ flatten });
  const counts: Record<string, number> = {};

  nodes.forEach((node) => {
    if (node.nodeType === 3) {
      // Text node
      if (!allowTextNodes) {
        node.parentNode?.removeChild(node);
        valid = false;
      }
      return;
    }

    if (node.nodeType !== 1) return; // Only process elements

    const tagName = node.nodeName;
    let allowed = false;

    if (typeof validElements === "string") {
      if (tagName.toLowerCase() === validElements.toLowerCase()) {
        allowed = true;
      }
    } else if (Array.isArray(validElements)) {
      if (validElements.some((v) => v.toLowerCase() === tagName.toLowerCase())) {
        allowed = true;
      }
    } else if (typeof validElements === "object" && validElements !== null) {
      const max = validElements[tagName] ?? validElements[tagName.toLowerCase()];
      if (max !== undefined) {
        if (max === -1 || (counts[tagName] || 0) < max) {
          allowed = true;
          counts[tagName] = (counts[tagName] || 0) + 1;
        }
      }
    }

    if (!allowed) {
      node.parentNode?.removeChild(node);
      valid = false;
    }
  });

  return valid;
}
