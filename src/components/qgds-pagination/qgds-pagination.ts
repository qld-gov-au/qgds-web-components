import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { QgdsEvents } from "../../utils/events/event-controller";

// Import QGDS Icons for some controls (show more, chevron and arrows)
import "../qgds-icon/qgds-icon";

import { baseStyles, utilitiesStyles } from "../../styles";
import componentCSS from "./qgds-pagination.styles.scss?inline";

/** Renders pagination controls and emits navigation intents.
 *
 * @uikit pagination
 * @website https://www.qld.gov.au/dsiti/design-system/components/pagination
 *
 * @prop { Number } [currentPage=1] - The current page number
 * @prop { Number } [totalPages=1] - The total number of pages
 * @prop { String } [prevLabel="Back"] - The label for the previous page button
 * @prop { String } [nextLabel="Next"] - The label for the next page button
 * @prop { String } [showPrevNext="always"] - Whether to show previous/next links: "default" or "always"
 * @prop { String } [navAriaLabel="Page navigation"] - The aria-label to indicate page navigation
 * @prop { String } [linkBase=""] - The base URL for page links (e.g. "/articles?page=")
 *
 * @event qgds-navigate - Emits a cancelable event when a page link is clicked.
 */

@customElement("qgds-pagination")
export class QGDSPagination extends LitElement {
  static styles = [
    baseStyles,
    utilitiesStyles,
    css`
      ${unsafeCSS(componentCSS)}
    `,
  ];

  // Shared helper for dispatching qgds custom events.
  private events = new QgdsEvents(this);

  // Maximum number of numeric page links shown before clipping logic applies.
  // M = More icon

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

  @property({ type: String, attribute: "aria-label" })
  navAriaLabel: string = "Page navigation";

  @property({ type: String, reflect: true, attribute: "show-prev-next" })
  showPrevNext: "always" | "default" = "always";

  private get normalisedTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  private get normalisedCurrentPage(): number {
    return Math.min(Math.max(1, this.currentPage), this.normalisedTotalPages);
  }

  private get normalisedShowPrevNext(): "always" | "default" {
    return this.showPrevNext === "always" ? "always" : "default";
  }

  private isClipped(): boolean {
    return this.normalisedTotalPages > this.maxPageNumbersToShow;
  }

  /** Determines if a boundary action (previous/next) is disabled based on the current page */
  private isBoundaryActionDisabled(target: HTMLAnchorElement): boolean {
    if (target.classList.contains("prev-link")) {
      return this.normalisedCurrentPage <= 1;
    }
    if (target.classList.contains("next-link")) {
      return this.normalisedCurrentPage >= this.normalisedTotalPages;
    }
    return false;
  }

  private renderPageNumbers() {
    const totalPages = this.normalisedTotalPages;

    const moreIconPositions: Record<number, string> = {};
    if (this.isClipped()) {
      // Place ellipsis markers at fixed positions. CSS range classes decide visibility.
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
    const total = this.normalisedTotalPages;
    const current = this.normalisedCurrentPage;
    const isActive = page === current;

    // Keep first/last pages and a compact window around the current page.
    const isEdge = page === 1 || page === total;
    const isNearCurrent = Math.abs(page - current) <= 1; // Show current +/- 1
    const withinStartRange = current <= 4 && page <= 5; // Special case for start
    const withinEndRange = current >= total - 3 && page >= total - 4; // Special case for end
    const withinMiddleRange = !isEdge && !withinStartRange && !withinEndRange && isNearCurrent;

    // Mobile uses a narrower window than desktop.
    const withinMobileStartRange = current <= 3 && page <= 3;
    const withinMobileEndRange = current >= total - 2 && page >= total - 2;

    // Skip rendering items that are not visible in either desktop or mobile layouts.
    if (
      !isEdge &&
      !withinStartRange &&
      !withinEndRange &&
      !withinMiddleRange &&
      !withinMobileStartRange &&
      !withinMobileEndRange
    ) {
      return null;
    }

    // Apply classes so CSS can toggle visibility by range and viewport.
    const classes = {
      "page-item": true,
      "is-active": isActive,
      "is-pinned-desktop":
        !this.isClipped() || isEdge || isActive || withinStartRange || withinEndRange || withinMiddleRange,
      "is-pinned-mobile": isEdge || isActive || withinMobileStartRange || withinMobileEndRange,
    };

    return html`
      <li class=${classMap(classes)} data-page="${page}">
        <a
          class="base-link page-link ${isActive ? "active" : ""}"
          href="${this.linkBase}${page}"
          aria-label="Page ${page} ${isActive ? "(current page)" : ""}"
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
      <li class="page-item page-more ${classname}" aria-hidden="true">
        <qgds-icon class="base-icon more-icon" icon-id="more-horizontal"></qgds-icon>
      </li>
    `;
  }

  private renderPaginationList() {
    const showPrevNextAlways = this.normalisedShowPrevNext === "always";
    const showPrevLink = showPrevNextAlways || this.normalisedCurrentPage > 1;
    const showNextLink = showPrevNextAlways || this.normalisedCurrentPage < this.normalisedTotalPages;
    const isPrevDisabled = this.normalisedCurrentPage <= 1;
    const isNextDisabled = this.normalisedCurrentPage >= this.normalisedTotalPages;

    const classes = {
      "is-clipped": this.isClipped(),
      "is-start-range": this.normalisedCurrentPage <= 4,
      "is-end-range": this.normalisedCurrentPage >= this.normalisedTotalPages - 3,
      "is-mobile-start-range": this.normalisedCurrentPage <= 3,
      "is-mobile-end-range": this.normalisedCurrentPage >= this.normalisedTotalPages - 2,
    };

    return html`
      <ul class="pagination ${classMap(classes)}">
        ${showPrevLink
          ? html`
              <li class="prev-item ${isPrevDisabled ? "disabled" : ""}">
                <a
                  class="base-link prev-link ${isPrevDisabled ? "is-disabled" : ""}"
                  href="${this.linkBase}${Math.max(1, this.normalisedCurrentPage - 1)}"
                  aria-disabled=${ifDefined(isPrevDisabled ? "true" : undefined)}
                  tabindex=${ifDefined(isPrevDisabled ? "-1" : undefined)}
                  @click=${this._handleClick}
                >
                  <qgds-icon size="md" icon-id="arrow-left" class="base-icon"></qgds-icon>
                  <span class="sr-only">${this.prevLabel}</span>
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
                  class="base-link next-link ${isNextDisabled ? "is-disabled" : ""}"
                  href="${this.linkBase}${Math.min(this.normalisedTotalPages, this.normalisedCurrentPage + 1)}"
                  aria-disabled=${ifDefined(isNextDisabled ? "true" : undefined)}
                  tabindex=${ifDefined(isNextDisabled ? "-1" : undefined)}
                  @click=${this._handleClick}
                >
                  <span class="sr-only">${this.nextLabel}</span>
                  <span class="label">${this.nextLabel}</span>
                  <qgds-icon size="md" icon-id="arrow-right" class="base-icon"></qgds-icon>
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

    // Ignore boundary actions that are currently disabled (page 1 / last page).
    // This prevents an qgds-navigate event from firing when the user clicks "Previous" on the first page, or "Next" on the last page.
    if (this.isBoundaryActionDisabled(target)) {
      e.preventDefault();
      return;
    }

    const totalPages = this.normalisedTotalPages;
    const currentPage = this.normalisedCurrentPage;
    const href = target.getAttribute("href") ?? target.href;

    let action: "prev" | "next" | "page" = "page";
    let requestedPage: number | null = null;

    // Resolve the intended navigation action and destination page from the clicked link.
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

    // Emit a cancelable navigation intent so consumers can intercept and manage routing/state.
    const eventPayload = {
      action,
      requestedPage,
      currentPage,
      totalPages,
      href,
    };

    // Event is cancellable by the consumer.
    // If the event is cancelled, the pagination component will not update its current page, allowing the consumer to manage state and routing as needed.
    const navigationOutcome = this.events.dispatch("navigate", eventPayload, e);

    if (!navigationOutcome) {
      // If the event was cancelled, prevent the default link navigation behavior.
      e.preventDefault();
    }
  };

  render() {
    return html`
      <nav aria-label="${ifDefined(this.navAriaLabel)}">
        <!-- Accessible live region to announce page changes. -->
        <span class="sr-only" aria-live="polite" aria-atomic="true"
          >Page ${this.normalisedCurrentPage} of ${this.normalisedTotalPages}</span
        >
        ${this.renderPaginationList()}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "qgds-pagination": QGDSPagination;
  }
}
