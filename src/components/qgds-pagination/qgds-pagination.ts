import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

// Pending PR-45
// import { QgdsEvents } from "../../utils/events/event-controller";

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
 * @prop { String } [ariaLabel="Pagination navigation"] - The aria-label for the pagination navigation
 * @prop { String } [linkBase=""] - The base URL for page links (e.g. "/articles?page=")
 *
 * @event click - Emitted when a page link is clicked, with detail of the selected page number or "prev"/"next"
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
  // events = new QgdsEvents(this);

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

  @property({ type: Boolean, reflect: true, attribute: "no-reload" })
  noReload: boolean = false;

  // Number of sibling pages shown on each side of the current page.
  private readonly siblingCount = 1;

  private readonly fixedNoReloadSlots = 6;

  private get normalizedTotalPages(): number {
    return Math.max(1, this.totalPages);
  }

  private get normalizedCurrentPage(): number {
    return Math.min(Math.max(1, this.currentPage), this.normalizedTotalPages);
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

  private _renderNoReloadPageNumbers() {
    const totalPages = this.normalizedTotalPages;
    const currentPage = this.normalizedCurrentPage;
    const slots: (number | "ellipsis" | "placeholder")[] = [];

    if (totalPages <= this.fixedNoReloadSlots) {
      for (let page = 1; page <= totalPages; page++) {
        slots.push(page);
      }
      while (slots.length < this.fixedNoReloadSlots) {
        slots.push("placeholder");
      }
    } else if (currentPage <= 3) {
      slots.push(1, 2, 3, 4, "ellipsis", totalPages);
    } else if (currentPage >= totalPages - 2) {
      slots.push(
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      slots.push(
        1,
        "ellipsis",
        currentPage - 1,
        currentPage,
        "ellipsis",
        totalPages,
      );
    }

    return slots.map((slot) => {
      if (slot === "ellipsis") {
        return this.renderPageMore();
      }
      if (slot === "placeholder") {
        return this.renderPagePlaceholder();
      }
      return this.renderPageLink(slot);
    });
  }

  private _renderPageNumbers() {
    if (this.noReload) {
      return this._renderNoReloadPageNumbers();
    }

    const totalPages = this.normalizedTotalPages;
    const currentPage = this.normalizedCurrentPage;
    const pages: ReturnType<typeof html>[] = [];

    if (totalPages <= this.maxPageNumbersToShow) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(this.renderPageLink(page));
      }
      return pages;
    }

    // Reserve first and last pages, then compute the middle window.
    const middleSlots = this.maxPageNumbersToShow - 2;
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

    const hasLeadingGap = leftBoundary > 2;
    const hasTrailingGap = rightBoundary < totalPages - 1;
    const needsMobileLeadingGap = !hasLeadingGap && currentPage > 2;
    const needsMobileTrailingGap =
      !hasTrailingGap && currentPage < totalPages - 1;

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

    if (this.noReload) {
      e.preventDefault();
    }

    if (this.isBoundaryActionDisabled(target)) {
      e.preventDefault();
      return;
    }

    const totalPages = this.normalizedTotalPages;
    const currentPage = this.normalizedCurrentPage;
    const href = target.getAttribute("href") ?? target.href;

    let action: "prev" | "next" | "page" = "page";
    let page: number | null = null;

    if (target.classList.contains("prev-link")) {
      action = "prev";
      page = Math.max(1, currentPage - 1);
    } else if (target.classList.contains("next-link")) {
      action = "next";
      page = Math.min(totalPages, currentPage + 1);
    } else if (target.classList.contains("page-link")) {
      const pageToken = href.replace(this.linkBase, "");
      const parsedPage = Number(pageToken);
      page = Number.isNaN(parsedPage) ? null : parsedPage;
    }

    const eventPayload = {
      action,
      page,
      currentPage,
      totalPages,
      href,
    };

    // Pending PR-45
    // this.events.dispatch("navigate", eventPayload, e);

    // Temporary to test
    this.dispatchEvent(
      new CustomEvent("qgds-navigate", {
        detail: eventPayload,
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    const showPrevLink = this.noReload || this.currentPage > 1;
    const showNextLink = this.noReload || this.currentPage < this.totalPages;
    const isPrevDisabled = this.normalizedCurrentPage <= 1;
    const isNextDisabled =
      this.normalizedCurrentPage >= this.normalizedTotalPages;

    return html`
      <nav aria-label="${ifDefined(this.ariaLabel)}">
        <ul class="pagination">
          ${showPrevLink
            ? html`
                <li class="prev-item ${isPrevDisabled ? "disabled" : ""}">
                  <a
                    class="prev-link ${isPrevDisabled ? "is-disabled" : ""}"
                    href="${this.linkBase}${Math.max(
                      1,
                      this.normalizedCurrentPage - 1,
                    )}"
                    aria-label="${this.prevLabel}"
                    aria-disabled=${ifDefined(
                      isPrevDisabled ? "true" : undefined,
                    )}
                    @click=${this._handleClick}>
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
                    href="${this.linkBase}${Math.min(
                      this.normalizedTotalPages,
                      this.normalizedCurrentPage + 1,
                    )}"
                    aria-label="${this.nextLabel}"
                    aria-disabled=${ifDefined(
                      isNextDisabled ? "true" : undefined,
                    )}
                    @click=${this._handleClick}>
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
