import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
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
 * @event qgds-navigate - Emitted when a page link is clicked, with detail of the selected page number or "prev"/"next"
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
  events = new QgdsEvents(this);

  // Max page numbers to show in the pagination (excluding prev/next and ellipses)
  private readonly maxPageNumbersToShow = 6;

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

  // Number of sibling pages shown on each side of the current page.
  private readonly siblingCount = 1;

  private get normalizedTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  private get normalizedCurrentPage(): number {
    return Math.min(Math.max(1, this.currentPage), this.normalizedTotalPages);
  }

  private get normalizedShowPrevNext(): "default" | "always" {
    return this.showPrevNext === "always" ? "always" : "default";
  }

  private isBoundaryActionDisabled(target: HTMLAnchorElement): boolean {
    if (target.classList.contains("prev-link")) {
      return this.normalizedCurrentPage <= 1;
    }
    if (target.classList.contains("next-link")) {
      return this.normalizedCurrentPage >= this.normalizedTotalPages;
    }
    return false;
  }

  /* Render Page Numbers with Ellipses
   *  This method calculates the range of page numbers to display based on the current page and the specified page range.
   *  It also determines whether to show ellipses ("...") when there are more pages than can be displayed within the page range.
   *
   * The method returns an array of HTML templates for the page number links, including active state and accessibility attributes.
   *
   * @returns An array of HTML templates for page number links, including ellipses if applicable.
   */
  private renderPageLink(page: number) {
    const totalPages = this.normalizedTotalPages;
    const normalizedCurrentPage = this.normalizedCurrentPage;
    const isActive = page === normalizedCurrentPage;
    const itemClasses = ["page-item"];

    if (page === 1) {
      itemClasses.push("is-first-page");
    }
    if (page === totalPages) {
      itemClasses.push("is-last-page");
    }
    if (isActive) {
      itemClasses.push("is-active");
    }

    return html`
      <li class="${itemClasses.join(" ")}">
        <a
          class="page-link ${isActive ? "active" : ""}"
          href="${this.linkBase}${page}"
          aria-label="Page ${page}"
          aria-current=${ifDefined(isActive ? "page" : undefined)}
          @click=${this._handleClick}
          >${page}</a
        >
      </li>
    `;
  }

  private renderPageMore(isMobileOnly = false) {
    return html` <li class="page-more ${isMobileOnly ? "is-mobile-only" : ""}">
      <qgds-icon size="md" icon-id="more-horizontal"></qgds-icon>
    </li>`;
  }

  private renderPagePlaceholder() {
    return html`<li class="page-item page-placeholder" aria-hidden="true">
      <span class="page-link page-link-placeholder"></span>
    </li>`;
  }

  private _renderPageNumbers() {
    const totalPages = this.normalizedTotalPages;
    const currentPage = this.normalizedCurrentPage;
    const pages: ReturnType<typeof html>[] = [];

    if (totalPages <= this.maxPageNumbersToShow) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(this.renderPageLink(page));
      }
      return pages;
    }

    const computeWindow = (requestedMiddleSlots: number) => {
      const middleSlots = Math.max(1, requestedMiddleSlots);
      const halfWindow = Math.floor(middleSlots / 2);
      let leftBoundary = currentPage - halfWindow;
      let rightBoundary = currentPage + (middleSlots - halfWindow - 1);

      // Clamp middle window to valid inner-page bounds [2, totalPages - 1].
      if (leftBoundary < 2) {
        rightBoundary += 2 - leftBoundary;
        leftBoundary = 2;
      }
      if (rightBoundary > totalPages - 1) {
        leftBoundary -= rightBoundary - (totalPages - 1);
        rightBoundary = totalPages - 1;
      }

      leftBoundary = Math.max(2, leftBoundary);
      rightBoundary = Math.min(totalPages - 1, rightBoundary);

      return {
        leftBoundary,
        rightBoundary,
        hasLeadingGap: leftBoundary > 2,
        hasTrailingGap: rightBoundary < totalPages - 1,
      };
    };

    // Reserve first and last pages, then compute the middle window.
    const baseMiddleSlots = this.maxPageNumbersToShow - 2;
    let { leftBoundary, rightBoundary, hasLeadingGap, hasTrailingGap } = computeWindow(baseMiddleSlots);

    // When both ellipses are visible, shrink the middle window by one slot
    // so the overall pagination footprint stays stable.
    if (hasLeadingGap && hasTrailingGap) {
      ({ leftBoundary, rightBoundary, hasLeadingGap, hasTrailingGap } = computeWindow(baseMiddleSlots - 1));
    }

    const needsMobileLeadingGap = !hasLeadingGap && currentPage > 2;
    const needsMobileTrailingGap = !hasTrailingGap && currentPage < totalPages - 1;

    pages.push(this.renderPageLink(1));

    if (hasLeadingGap) {
      pages.push(this.renderPageMore());
    } else if (needsMobileLeadingGap) {
      pages.push(this.renderPageMore(true));
    }

    for (let page = leftBoundary; page <= rightBoundary; page++) {
      pages.push(this.renderPageLink(page));
    }

    if (hasTrailingGap) {
      pages.push(this.renderPageMore());
    } else if (needsMobileTrailingGap) {
      pages.push(this.renderPageMore(true));
    }

    pages.push(this.renderPageLink(totalPages));

    return pages;
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

    if (navigationCancelled) {
      e.preventDefault();
    }
  };

  render() {
    const showPrevNextAlways = this.normalizedShowPrevNext === "always";
    const showPrevLink = showPrevNextAlways || this.normalizedCurrentPage > 1;
    const showNextLink = showPrevNextAlways || this.normalizedCurrentPage < this.normalizedTotalPages;
    const isPrevDisabled = this.normalizedCurrentPage <= 1;
    const isNextDisabled = this.normalizedCurrentPage >= this.normalizedTotalPages;

    return html`
      <nav aria-label="${ifDefined(this.ariaLabel)}">
        <ul class="pagination">
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
          ${this._renderPageNumbers()}
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
      </nav>
    `;
  }
}
