export class Scrollbar {
  /**
   * @typedef {{totalSize: number, scrollListener: function(...[*]=), horizontal: boolean=}} ScrollbarParams
   */
  /**
   * @param {HTMLElement} viewportNode
   * @param {ScrollbarParams} params
   */
  static build(viewportNode, params) {
    return new Scrollbar(viewportNode, params);
  }

  /**
   * @param {HTMLElement} viewportNode
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
     */
    this.viewportNode = viewportNode;
    /**
     * @private
     */
    this.totalSize = params.totalSize;
    /**
     * @private
     */
    this.scrollListener = params.scrollListener;
    /**
     * @private
     */
    this.horizontal = params.horizontal;
    /**
     * @private
     */
    this.viewportSize = this.horizontal ? this.viewportNode.offsetWidth : this.viewportNode.offsetHeight;
    /**
     * @private
     */
    this.maxBrowserScrollSize = calcMaxBrowserScrollSize(this.horizontal);
    /**
     * @private
     */
    this.scrollSize = this.maxBrowserScrollSize > this.totalSize ? this.totalSize : this.maxBrowserScrollSize;
    /**
     * @private
     */
    this.pageSize = Math.floor(this.maxBrowserScrollSize / 100);
    /**
     * @private
     */
    this.pageCount = Math.ceil(this.totalSize / this.pageSize);
    /**
     * @private
     */
    this.overlapSize = this.totalSize > this.maxBrowserScrollSize ? (this.totalSize - this.maxBrowserScrollSize) / (this.pageCount - 1) : 1;

    /**
     * @private
     */
    this.currentPage = 0;
    /**
     * @private
     */
    this.prevViewportScrollTop = 0;
    /**
     * @private
     */
    this.scrollRafId = null;

    /**
     * @private
     */
    this.currentPageOffset = 0;

    /**
     * @private
     */
    this.runwayNode = document.createElement('div');
    this.runwayNode.style[this.horizontal ? 'width' : 'height'] = this.scrollSize + 'px';
    this.runwayNode.style.position = 'relative';
    this.runwayNode.style.visibility = 'hidden';
    this.runwayNode.style.overflow = 'hidden';
    this.runwayNode.style.width = '1px';
    this.viewportNode.appendChild(this.runwayNode);

    /**
     * @private
     */
    this.scheduleScroll = this.scheduleScroll.bind(this);
    this.viewportNode.addEventListener('scroll', this.scheduleScroll);
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
      this.doScroll();
    });
  }

  /**
   * @private
   */
  doScroll() {
    const viewportScrollTop = this.viewportNode.scrollTop;
    if (Math.abs(viewportScrollTop - this.prevViewportScrollTop) > this.viewportSize) {
      this.onJump();
    } else {
      this.onSmoothScroll();
    }

    this.scrollTop = this.viewportNode.scrollTop + this.currentPageOffset;
    this.scrollListener();
  }

  /**
   * @private
   */
  onSmoothScroll() {
    const scrollTop = this.viewportNode.scrollTop;

    // next page
    if ((scrollTop + this.viewportSize) + this.currentPageOffset > (this.currentPage + 1) * this.pageSize) {
      this.currentPage += 1;
      this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
      this.viewportNode.scrollTop = ((this.prevViewportScrollTop = scrollTop - this.overlapSize));
      return;
    }

    // prev page
    if (this.currentPage && (scrollTop + this.currentPageOffset) <= this.currentPage * this.pageSize) {
      this.currentPage -= 1;
      this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
      this.viewportNode.scrollTop = ((this.prevViewportScrollTop = scrollTop + this.overlapSize));
      return;
    }

    this.prevViewportScrollTop = scrollTop;
  }

  /**
   * @private
   */
  onJump() {
    const viewportScrollTop = this.viewportNode.scrollTop;
    this.currentPage = Math.floor(viewportScrollTop * ((this.totalSize - this.viewportSize) / (this.scrollSize - this.viewportSize)) * (1 / this.pageSize));
    this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
    this.prevViewportScrollTop = viewportScrollTop;
  }

  /**
   * Calculate actual position on viewport for passed scrollbar position
   * @param {number} position
   * @return {number} Actual position on viewport
   */
  calc(position) {
    return position - this.currentPageOffset;
  }

  destroy() {
    this.viewportNode.removeChild(this.runwayNode);
    this.viewportNode.removeEventListener('scroll', this.scheduleScroll);
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
