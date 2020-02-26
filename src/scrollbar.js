export class Scrollbar {
  static build(viewport, params) {
    return new Scrollbar(viewport, params);
  }

  constructor(viewport, params) {
    const scrollbar = this;
    const viewportSize = viewport.offsetHeight;
    const totalSize = params.totalSize;
    const maxBrowserScrollSize = calcMaxBrowserScrollSize();
    const scrollSize = maxBrowserScrollSize > totalSize ? totalSize : maxBrowserScrollSize;
    const pageSize = Math.floor(maxBrowserScrollSize / 100);
    const numberOfPages = Math.ceil(totalSize / pageSize);
    const overlapSize = totalSize > maxBrowserScrollSize ? (totalSize - maxBrowserScrollSize) / (numberOfPages - 1) : 1;

    let currentPage = 0;
    let prevScrollTop = 0;

    scrollbar.currentPageOffset = 0;
    scrollbar.scrollTop = 0;

    const runway = document.createElement('div');
    runway.style.height = scrollSize + 'px';
    runway.style.position = 'relative';
    runway.style.visibility = 'hidden';
    runway.style.overflow = 'hidden';
    runway.style.width = '1px';

    viewport.appendChild(runway);
    viewport.addEventListener('scroll', onScroll);

    function onScroll() {
      const scrollTop = viewport.scrollTop;
      if (Math.abs(scrollTop - prevScrollTop) > viewportSize) {
        onJump();
      } else {
        onNearScroll();
      }

      scrollbar.scrollTop = viewport.scrollTop + scrollbar.currentPageOffset;
      params.onScroll();
    }

    function onNearScroll() {
      const scrollTop = viewport.scrollTop;

      // next page
      if ((scrollTop + viewportSize) + scrollbar.currentPageOffset > (currentPage + 1) * pageSize) {
        currentPage++;
        scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
        viewport.scrollTop = ((prevScrollTop = scrollTop - overlapSize));
      } else if (currentPage && scrollTop + scrollbar.currentPageOffset <= currentPage * pageSize) {
        // prev page
        currentPage--;
        scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
        viewport.scrollTop = ((prevScrollTop = scrollTop + overlapSize));
      } else prevScrollTop = scrollTop;
    }

    function onJump() {
      const scrollTop = viewport.scrollTop;
      currentPage = Math.floor(scrollTop * ((totalSize - viewportSize) / (scrollSize - viewportSize)) * (1 / pageSize));
      scrollbar.currentPageOffset = Math.round(currentPage * overlapSize);
      prevScrollTop = scrollTop;
    }
  }

  convertVirtualPositionToActual(virtualPosition) {
    return virtualPosition - this.currentPageOffset;
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
