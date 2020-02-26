import { calcMaxBrowserScrollSize, Scrollbar } from './scrollbar';

function main() {
  const itemsCount = calcMaxBrowserScrollSize();
  const itemSize = 50;
  const totalSize = itemsCount * itemSize;
  const rows = {}; // cached row nodes

  const viewport = document.getElementById('app');
  const viewportSize = viewport.offsetHeight;
  const scrollbar = Scrollbar.build(viewport, {
    totalSize: totalSize,
    scrollListener: () => renderRows()
  });
  renderRows();

  function renderRows() {
    const scrollTop = scrollbar.scrollTop;
    const buffer = viewportSize;
    const top = Math.max(Math.floor((scrollTop - buffer) / itemSize), 0);
    const bottom = Math.min(Math.ceil((scrollTop + viewportSize + buffer) / itemSize), (itemsCount - 1));

    // remove rows no longer in the viewport
    for (const i in rows) {
      if (i < top || i > bottom) {
        rows[i].parentNode.removeChild(rows[i]);
        delete rows[i];
      }
    }

    // add new rows
    for (let i = top; i <= bottom; i++) {
      if (!rows[i]) rows[i] = renderRow(i);
    }
  }

  function renderRow(row) {
    const rw = document.createElement('div');
    const style = rw.style;
    style.position = 'absolute';
    style.left = '0';
    style.width = '100%';
    style.boxSizing = 'border-box';
    style.borderBottom = '1px dotted blue';
    style.fontSize = '9pt';
    style.top = scrollbar.convertVirtualPositionToActual(row * itemSize) + 'px';
    style.height = itemSize + 'px';
    rw.innerText = 'row ' + (row + 1);
    viewport.appendChild(rw);
    return rw;
  }
}

main();
