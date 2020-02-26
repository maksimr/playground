export class Scrollbar {
  static build(viewport, params) {
    return new Scrollbar(viewport, params);
  }

  constructor(viewportNode, params) {
    const scrollbar = this;
    const horizontal = params.horizontal;
    const viewportSize = horizontal ? viewportNode.offsetWidth : viewportNode.offsetHeight;
    const totalSize = params.totalSize;
    const maxBrowserScrollSize = calcMaxBrowserScrollSize(horizontal);
    const scrollSize = maxBrowserScrollSize > totalSize ? totalSize : maxBrowserScrollSize;
    const pageSize = Math.floor(maxBrowserScrollSize / 100);
    const pageCount = Math.ceil(totalSize / pageSize);
    const overlapSize = totalSize > maxBrowserScrollSize ? (totalSize - maxBrowserScrollSize) / (pageCount - 1) : 1;

    let currentPage = 0;
    let prevScrollTop = 0;
    let scrollRafId = null;

    scrollbar.currentPageOffset = 0;
    scrollbar.scrollTop = 0;

    const runwayNode = document.createElement('div');
    runwayNode.style[horizontal ? 'width' : 'height'] = scrollSize + 'px';
    runwayNode.style.position = 'relative';
    runwayNode.style.visibility = 'hidden';
    runwayNode.style.overflow = 'hidden';
    runwayNode.style.width = '1px';

    viewportNode.appendChild(runwayNode);
    viewportNode.addEventListener('scroll', () => {
      if (scrollRafId) {
        return;
      }
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = null;
        onScroll();
      });
    });

    function onScroll() {
      const scrollTop = viewportNode.scrollTop;
      if (Math.abs(scrollTop - prevScrollTop) > viewportSize) {
        onJump();
      } else {
        onNearScroll();
      }

      scrollbar.scrollTop = viewportNode.scrollTop + scrollbar.currentPageOffset;
      params.onScroll();
    }

    function onNearScroll() {
      const scrollTop = viewportNode.scrollTop;

      // next page
      if ((scrollTop + viewportSize) + scrollbar.currentPageOffset > (currentPage + 1) * pageSize) {
        currentPage++;
        scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
        viewportNode.scrollTop = ((prevScrollTop = scrollTop - overlapSize));
      } else if (currentPage && scrollTop + scrollbar.currentPageOffset <= currentPage * pageSize) {
        // prev page
        currentPage--;
        scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
        viewportNode.scrollTop = ((prevScrollTop = scrollTop + overlapSize));
      } else prevScrollTop = scrollTop;
    }

    function onJump() {
      const scrollTop = viewportNode.scrollTop;
      currentPage = Math.floor(scrollTop * ((totalSize - viewportSize) / (scrollSize - viewportSize)) * (1 / pageSize));
      scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
      prevScrollTop = scrollTop;
    }
  }

  convertVirtualPositionToActual(virtualScrollPosition) {
    return virtualScrollPosition - this.currentPageOffset;
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
