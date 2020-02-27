export class Scrollbar {
  /**
   * @typedef {{totalSize: number, scrollListener: function(...[*]=), horizontal: boolean=}} ScrollbarParams
   */
  /**
   * @param {Element} viewportNode
   * @param {ScrollbarParams} params
   */
  static build(viewportNode, params) {
    return new Scrollbar(viewportNode, params);
  }

  /**
   * @param {Element} viewportNode
   * @param {ScrollbarParams} params
   */
  constructor(viewportNode, params) {
    /**
     * @public
     * @type number
     */
    this.scrollTop = 0;

    /**
     * @private
     * @type Element
     */
    this.viewportNode = viewportNode;
    /**
     * @private
     * @type Element
     */
    this.scrollNode = findScrollableNode(this.viewportNode);
    /**
     * @private
     * @type Element
     */
    this.scrollListenNode = this.scrollNode === document.documentElement ? window : this.scrollNode;
    /**
     * @private
     */
    this.totalSize = params.totalSize;
    /**
     * @private
     * @type function()
     */
    this.scrollListener = params.scrollListener;
    /**
     * @private
     * @type boolean
     */
    this.horizontal = params.horizontal;
    /**
     * @private
     * @type number
     */
    this.viewportSize = this.horizontal ? this.scrollNode.clientWidth : this.scrollNode.clientHeight;
    /**
     * @private
     * @type number
     */
    this.maxBrowserScrollSize = calcMaxBrowserScrollSize(this.horizontal);
    /**
     * @private
     * @type number
     */
    this.scrollSize = this.maxBrowserScrollSize > this.totalSize ? this.totalSize : this.maxBrowserScrollSize;
    /**
     * @private
     * @type number
     */
    this.pageSize = Math.floor(this.maxBrowserScrollSize / 100);
    /**
     * @private
     * @type number
     */
    this.pageCount = Math.ceil(this.totalSize / this.pageSize);
    /**
     * @private
     * @type number
     */
    this.overlapSize = this.totalSize > this.maxBrowserScrollSize ? (this.totalSize - this.maxBrowserScrollSize) / (this.pageCount - 1) : 1;

    /**
     * @private
     * @type number
     */
    this.currentPage = 0;
    /**
     * @private
     * @type number
     */
    this.prevViewportScrollTop = 0;
    /**
     * @private
     */
    this.scrollRafId = null;

    /**
     * @private
     * @type number
     */
    this.currentPageOffset = 0;

    /**
     * @private
     * @type Element
     */
    this.runwayNode = document.createElement('div');
    this.runwayNode.style[this.horizontal ? 'width' : 'height'] = this.scrollSize + 'px';
    this.runwayNode.style.position = 'relative';
    this.runwayNode.style.visibility = 'hidden';
    this.runwayNode.style.overflow = 'hidden';
    this.runwayNode.style.width = '1px';
    if (this.viewportNode.firstChild) {
      this.viewportNode.insertBefore(this.runwayNode, this.viewportNode.firstChild);
    } else {
      this.viewportNode.appendChild(this.runwayNode);
    }

    this.addScrollListener();
  }

  /**
   * @private
   */
  scheduleScroll() {
    if (this.scrollRafId) {
      return;
    }
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      this.onScroll();
    });
  }

  /**
   * @private
   */
  onScroll() {
    const viewportScrollTop = this.getViewportScrollTop();
    if (Math.abs(viewportScrollTop - this.prevViewportScrollTop) > this.viewportSize) {
      this.onJump();
    } else {
      this.onSmoothScroll();
    }

    this.prevViewportScrollTop = this.getViewportScrollTop();
    this.scrollTop = this.getViewportScrollTop() + this.currentPageOffset;
    this.scrollListener();
  }

  /**
   * @private
   * @return {number}
   */
  getViewportScrollTop() {
    return this.scrollNode.scrollTop;
  }

  /**
   * @private
   * @return {number}
   */
  setViewportScrollTop(viewportScrollTop) {
    return this.scrollNode.scrollTop = viewportScrollTop;
  }

  /**
   * @private
   */
  onSmoothScroll() {
    const scrollTop = this.getViewportScrollTop();

    if (scrollTop + this.currentPageOffset > (this.currentPage + 1) * this.pageSize) {
      this.scrollToNextPage();
    } else if (this.currentPage && (scrollTop + this.currentPageOffset) < this.currentPage * this.pageSize) {
      this.scrollToPrevPage();
    }
  }

  /**
   * @private
   */
  scrollToNextPage() {
    this.scrollOnPage(this.currentPage + 1);
  }

  /**
   * @private
   */
  scrollToPrevPage() {
    this.scrollOnPage(this.currentPage - 1);
  }

  /**
   * @private
   */
  onJump() {
    const viewportScrollTop = this.getViewportScrollTop();
    const pageNumber = Math.floor(viewportScrollTop * ((this.totalSize - this.viewportSize) / (this.scrollSize - this.viewportSize)) * (1 / this.pageSize));
    this.setCurrentPage(pageNumber);
  }

  /**
   * @private
   * @param {number} currentPage
   */
  scrollOnPage(currentPage) {
    const prevPage = this.currentPage;
    if (prevPage < currentPage) {
      this.setViewportScrollTop(this.getViewportScrollTop() - this.overlapSize);
    } else if (prevPage > currentPage) {
      this.setViewportScrollTop(this.getViewportScrollTop() + this.overlapSize);
    }
    this.setCurrentPage(currentPage);
  }

  /**
   * @private
   * @param {number} currentPage
   */
  setCurrentPage(currentPage) {
    this.currentPage = currentPage;
    this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
  }

  /**
   * @private
   */
  addScrollListener() {
    /**
     * @private
     */
    this.scheduleScroll = this.scheduleScroll.bind(this);
    this.scrollListenNode.addEventListener('scroll', this.scheduleScroll);
  }

  /**
   * @private
   */
  removeScrollListener() {
    this.scrollListenNode.removeEventListener('scroll', this.scheduleScroll);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @public
   * @param {number} scrollPosition
   */
  scrollTo(scrollPosition) {
    this.scrollTop = scrollPosition;
    this.scrollOnPage(Math.floor(scrollPosition / this.pageSize));
    this.setViewportScrollTop(this.prevViewportScrollTop = scrollPosition - this.currentPageOffset);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @public
   * Calculate actual position on viewport for passed scrollbar position
   * @param {number} position
   * @return {number} Actual position on viewport
   */
  calc(position) {
    return position - this.currentPageOffset;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @public
   */
  destroy() {
    this.viewportNode.removeChild(this.runwayNode);
    this.removeScrollListener();
    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
  }
}

/**
 * @param {boolean} horizontal
 * @return {number}
 */
export function calcMaxBrowserScrollSize(horizontal) {
  const div = document.createElement('div');
  const style = div.style;
  style.position = 'absolute';
  style.left = '99999999999999px';
  style.top = '9999999999999999px';
  document.body.appendChild(div);

  const size = div.getBoundingClientRect()[horizontal ? 'left' : 'top'];
  document.body.removeChild(div);
  return Math.abs(size);
}

/**
 * @param {Element|Node} node
 * @return {Element}
 */
function findScrollableNode(node) {
  while (node.parentNode && node.parentNode !== document) {
    const overflow = window.getComputedStyle(node).overflow;
    if (overflow === 'visible' || overflow === '') {
      node = node.parentNode;
      continue;
    }
    break;
  }
  return node;
}
