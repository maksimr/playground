function main() {
  function addResizeListener(element, fn) {
    if (window.getComputedStyle(element).position === 'static')
      element.style.position = 'relative';
    const obj = document.createElement('object');
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    obj.onload = () => obj.contentDocument.defaultView.addEventListener('resize', fn);
    obj.type = 'text/html';
    obj.data = 'about:blank';
    element.appendChild(obj);
    return () => {
      obj.contentDocument.defaultView.removeEventListener('resize', fn);
      element.removeChild(obj);
    };
  }

  addResizeListener(document.getElementById('app'), () => {
    console.log('resize');
  });
}

main();
