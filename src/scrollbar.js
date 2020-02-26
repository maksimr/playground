export class Scrollbar {
  /**
   * @typedef {{totalSize: number, scrollListener: function(...[*]=), horizontal: boolean}} ScrollbarParams
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
    this.viewportNode = viewportNode;
    this.totalSize = params.totalSize;
    this.scrollListener = params.scrollListener;
    this.horizontal = params.horizontal;
    this.viewportSize = this.horizontal ? this.viewportNode.offsetWidth : this.viewportNode.offsetHeight;
    this.maxBrowserScrollSize = calcMaxBrowserScrollSize(this.horizontal);
    this.scrollSize = this.maxBrowserScrollSize > this.totalSize ? this.totalSize : this.maxBrowserScrollSize;
    this.pageSize = Math.floor(this.maxBrowserScrollSize / 100);
    this.pageCount = Math.ceil(this.totalSize / this.pageSize);
    this.overlapSize = this.totalSize > this.maxBrowserScrollSize ? (this.totalSize - this.maxBrowserScrollSize) / (this.pageCount - 1) : 1;

    this.currentPage = 0;
    this.prevScrollTop = 0;
    this.scrollRafId = null;

    this.currentPageOffset = 0;
    this.scrollTop = 0;

    this.runwayNode = document.createElement('div');
    this.runwayNode.style[this.horizontal ? 'width' : 'height'] = this.scrollSize + 'px';
    this.runwayNode.style.position = 'relative';
    this.runwayNode.style.visibility = 'hidden';
    this.runwayNode.style.overflow = 'hidden';
    this.runwayNode.style.width = '1px';
    this.viewportNode.appendChild(this.runwayNode);

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
    const scrollTop = this.viewportNode.scrollTop;
    if (Math.abs(scrollTop - this.prevScrollTop) > this.viewportSize) {
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
      this.viewportNode.scrollTop = ((this.prevScrollTop = scrollTop - this.overlapSize));
      return;
    }

    // prev page
    if (this.currentPage && (scrollTop + this.currentPageOffset) <= this.currentPage * this.pageSize) {
      this.currentPage -= 1;
      this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
      this.viewportNode.scrollTop = ((this.prevScrollTop = scrollTop + this.overlapSize));
      return;
    }

    this.prevScrollTop = scrollTop;
  }

  /**
   * @private
   */
  onJump() {
    const scrollTop = this.viewportNode.scrollTop;
    this.currentPage = Math.floor(scrollTop * ((this.totalSize - this.viewportSize) / (this.scrollSize - this.viewportSize)) * (1 / this.pageSize));
    this.currentPageOffset = Math.round(this.currentPage * this.overlapSize);
    this.prevScrollTop = scrollTop;
  }

  convertVirtualPositionToActual(virtualScrollPosition) {
    return virtualScrollPosition - this.currentPageOffset;
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
