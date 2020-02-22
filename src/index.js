function main() {
  /**
   * @see http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/kjj
   * @param {HTMLElement} element
   * @param {Function} listener
   * @return {function(...[*]=)}
   */
  function addResizeListener(element, listener) {
    if (window.getComputedStyle(element).position === 'static')
      element.style.position = 'relative';
    const obj = document.createElement('object');
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    obj.onload = () => obj.contentDocument.defaultView.addEventListener('resize', listener);
    obj.type = 'text/html';
    obj.data = 'about:blank';
    element.appendChild(obj);
    return () => {
      obj.contentDocument.defaultView.removeEventListener('resize', listener);
      element.removeChild(obj);
    };
  }

  addResizeListener(document.getElementById('app'), () => {
    console.log('resize');
  });
}

main();
