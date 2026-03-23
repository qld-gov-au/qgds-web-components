import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { QgdsEvents } from "../../utils/events/event-controller";

// Import QGDS Icons for some controls (show more, chevron and arrows)
import "../qgds-icon/qgds-icon";

import { baseStyles } from "../../styles";
import componentCSS from "./qgds-pagination.styles.scss?inline";

export type QGDSPaginationProps = InstanceType<typeof QGDSPagination>;

/** Used to navigate through paged content
 *
 * @uikit pagination
 * @website https://www.qld.gov.au/dsiti/design-system/components/pagination
 *
 * @prop { Number } [currentPage=1] - The current page number
 * @prop { Number } [totalPages=1] - The total number of pages
 * @prop { String } [prevLabel="Back"] - The label for the previous page button
 * @prop { String } [nextLabel="Next"] - The label for the next page button
 * @prop { String } [showPrevNext="default"] - Whether to show previous/next links: "default" or "always"
 * @prop { String } [ariaLabel="Pagination navigation"] - The aria-label for the pagination navigation
 * @prop { String } [linkBase=""] - The base URL for page links (e.g. "/articles?page=")
 *
 * @event qgds-navigate - Emits a cancelable event when a page link is clicked.
 *
 *
 */

@customElement("qgds-pagination")
export class QGDSPagination extends LitElement {
  static styles = [
    baseStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // Bind common events handler - Pending PR-45
  private events = new QgdsEvents(this);

  // Max page numbers to show in the pagination (excluding prev/next and ellipses)

  // DESKTOP
  // Close to start:  [1, 2, 3, 4, 5, M, 10]
  // Middle range:    [1, 2, M, 6, 7, M, 10]
  // Close to end:    [1, M, 6, 7, 8, 9, 10]

  // MOBILE
  // Close to start:  [1, 2, 3, M, 10]
  // Middle range:    [1, M, 6, M, 10]
  // Close to end:    [1, M, 8, 9, 10]
  private readonly maxPageNumbersToShow = 7;

  /* Properties */
  @property({ type: Number, reflect: true, attribute: "current-page" })
  currentPage: number = 1;

  @property({ type: Number, reflect: true, attribute: "total-pages" })
  totalPages: number = 1;

  @property({ type: String, reflect: true, attribute: "prev-label" })
  prevLabel: string = "Back";

  @property({ type: String, reflect: true, attribute: "next-label" })
  nextLabel: string = "Next";

  @property({ type: String, reflect: true, attribute: "link-base" })
  linkBase: string = "";

  @property({ type: String, reflect: true, attribute: "aria-label" })
  ariaLabel: string = "Pagination navigation";

  @property({ type: String, reflect: true, attribute: "show-prev-next" })
  showPrevNext: "default" | "always" = "default";

  private get normalizedTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  private get normalizedCurrentPage(): number {
    return Math.min(Math.max(1, this.currentPage), this.normalizedTotalPages);
  }

  private get normalizedShowPrevNext(): "default" | "always" {
    return this.showPrevNext === "always" ? "always" : "default";
  }

  private isClipped(): boolean {
    return this.normalizedTotalPages > this.maxPageNumbersToShow;
  }

  /** Determines if a boundary action (previous/next) is disabled based on the current page */
  private isBoundaryActionDisabled(target: HTMLAnchorElement): boolean {
    if (target.classList.contains("prev-link")) {
      return this.normalizedCurrentPage <= 1;
    }
    if (target.classList.contains("next-link")) {
      return this.normalizedCurrentPage >= this.normalizedTotalPages;
    }
    return false;
  }

  private renderPageNumbers() {
    const totalPages = this.normalizedTotalPages;

    const moreIconPositions: Record<number, string> = {};
    if (this.isClipped()) {
      // Insert the leading ellipsis after page 2 so in middle ranges
      // it appears before page 3 (e.g. 1, ..., 3, 4, 5, ..., last).
      moreIconPositions[2] = "page-more-leading";
      moreIconPositions[totalPages - 3] = "page-more-trailing";
    }

    const pageLinks: ReturnType<typeof html>[] = [];
    for (let page = 1; page <= totalPages; page += 1) {
      pageLinks.push(this.renderPageLink(page));

      if (moreIconPositions[page]) {
        pageLinks.push(this.renderMoreIcon(moreIconPositions[page]));
      }
    }
    return pageLinks;
  }

  private renderPageLink(page: number) {
    const total = this.normalizedTotalPages;
    const current = this.normalizedCurrentPage;
    const isActive = page === current;

    // Logic: Is this page near the "edges" or the "current selection"?
    // We use a simple distance check instead of complex window clamping.
    const isEdge = page === 1 || page === total;
    const isNearCurrent = Math.abs(page - current) <= 1; // Show current +/- 1
    const withinStartRange = current <= 4 && page <= 5; // Special case for start
    const withinEndRange = current >= total - 3 && page >= total - 4; // Special case for end
    const withinMiddleRange = !isEdge && !withinStartRange && !withinEndRange && isNearCurrent;

    // Mobile edge cases
    const withinMobileStartRange = current <= 3 && page <= 3; // Show one less page on mobile
    const withinMobileEndRange = current >= total - 2 && page >= total - 2;

    const classes = {
      "page-item": true,
      "is-active": isActive,
      "is-pinned": !this.isClipped() || isEdge || isActive || withinStartRange || withinEndRange || withinMiddleRange,
      "is-pinned-mobile": isEdge || isActive || withinMobileStartRange || withinMobileEndRange, // Only pin edges on mobile when clipped
    };

    return html`
      <li class=${classMap(classes)} data-page="${page}">
        <a
          class="page-link ${isActive ? "active" : ""}"
          href="${this.linkBase}${page}"
          aria-current=${ifDefined(isActive ? "page" : undefined)}
          @click=${this._handleClick}
        >
          ${page}
        </a>
      </li>
    `;
  }

  private renderMoreIcon(classname: string) {
    return html`
      <li class="page-item page-more ${classname}">
        <qgds-icon icon-id="more-horizontal"></qgds-icon>
      </li>
    `;
  }

  private renderPaginationList() {
    const showPrevNextAlways = this.normalizedShowPrevNext === "always";
    const showPrevLink = showPrevNextAlways || this.normalizedCurrentPage > 1;
    const showNextLink = showPrevNextAlways || this.normalizedCurrentPage < this.normalizedTotalPages;
    const isPrevDisabled = this.normalizedCurrentPage <= 1;
    const isNextDisabled = this.normalizedCurrentPage >= this.normalizedTotalPages;

    const classes = {
      "is-clipped": this.isClipped(),
      "is-start-range": this.normalizedCurrentPage <= 4,
      "is-end-range": this.normalizedCurrentPage >= this.normalizedTotalPages - 3,
      "is-mobile-start-range": this.normalizedCurrentPage <= 3,
      "is-mobile-end-range": this.normalizedCurrentPage >= this.normalizedTotalPages - 2,
    };

    return html`
      <ul class="pagination ${classMap(classes)}">
        ${showPrevLink
          ? html`
              <li class="prev-item ${isPrevDisabled ? "disabled" : ""}">
                <a
                  class="prev-link ${isPrevDisabled ? "is-disabled" : ""}"
                  href="${this.linkBase}${Math.max(1, this.normalizedCurrentPage - 1)}"
                  aria-label="${this.prevLabel}"
                  aria-disabled=${ifDefined(isPrevDisabled ? "true" : undefined)}
                  @click=${this._handleClick}
                >
                  <qgds-icon size="md" icon-id="arrow-left"></qgds-icon>
                  <span class="label">${this.prevLabel}</span>
                </a>
              </li>
            `
          : null}
        ${this.renderPageNumbers()}
        ${showNextLink
          ? html`
              <li class="next-item ${isNextDisabled ? "disabled" : ""}">
                <a
                  class="next-link ${isNextDisabled ? "is-disabled" : ""}"
                  href="${this.linkBase}${Math.min(this.normalizedTotalPages, this.normalizedCurrentPage + 1)}"
                  aria-label="${this.nextLabel}"
                  aria-disabled=${ifDefined(isNextDisabled ? "true" : undefined)}
                  @click=${this._handleClick}
                >
                  <span class="label">${this.nextLabel}</span>
                  <qgds-icon size="md" icon-id="arrow-right"></qgds-icon>
                </a>
              </li>
            `
          : null}
      </ul>
    `;
  }

  private _handleClick = (e: Event): void => {
    const target = e.currentTarget as HTMLAnchorElement | null;
    if (!target) {
      return;
    }

    if (this.isBoundaryActionDisabled(target)) {
      e.preventDefault();
      return;
    }

    const totalPages = this.normalizedTotalPages;
    const currentPage = this.normalizedCurrentPage;
    const href = target.getAttribute("href") ?? target.href;

    let action: "prev" | "next" | "page" = "page";
    let requestedPage: number | null = null;

    if (target.classList.contains("prev-link")) {
      action = "prev";
      requestedPage = Math.max(1, currentPage - 1);
    } else if (target.classList.contains("next-link")) {
      action = "next";
      requestedPage = Math.min(totalPages, currentPage + 1);
    } else if (target.classList.contains("page-link")) {
      const pageToken = href.replace(this.linkBase, "");
      const parsedPage = Number(pageToken);
      requestedPage = Number.isNaN(parsedPage) ? null : parsedPage;
    }

    const eventPayload = {
      action,
      requestedPage,
      currentPage,
      totalPages,
      href,
    };

    const navigationCancelled = !this.events.dispatch("navigate", eventPayload, e);

    // Apply a fallback visual update only when no listener has already
    // updated currentPage during event dispatch.
    if (requestedPage !== null && this.currentPage === currentPage) {
      this.currentPage = requestedPage;
    }

    if (navigationCancelled) {
      e.preventDefault();
    }
  };

  render() {
    return html` <nav aria-label="${ifDefined(this.ariaLabel)}">${this.renderPaginationList()}</nav> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-pagination": QGDSPagination;
  }
}
