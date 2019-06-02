require('raw-loader!../index.html');

window.customElements.define('p-resizable', class ResizablePanelsElement extends HTMLElement {
  connectedCallback() {
    const split = require('split.js').default;
    const rootNode = this;
    const direction = rootNode.getAttribute('direction') || 'horizontal';

    rootNode.style.display = 'flex';
    rootNode.style.flexDirection = direction === 'horizontal' ? 'row' : 'column';
    const nodes = Array.from(rootNode.childNodes)
      .filter((it) => (it.nodeType === Node.ELEMENT_NODE));

    split(nodes, {
      gutterSize: 5,
      direction: direction,
      gutter: () => document.createElement('p-resizer'),
      onDragStart: dispatchEvent('resizestart'),
      onDragEnd: dispatchEvent('resizeend')
    });


    function dispatchEvent(eventName) {
      return function(data) {
        rootNode.dispatchEvent(new CustomEvent(eventName, {
          bubbles: true,
          cancelable: false,
          detail: data
        }));
      };
    }
  }
});


document.getElementById('foo').addEventListener('resizestart', (event) => {
  event.target.classList.add('resizing');
});

document.getElementById('foo').addEventListener('resizeend', (event) => {
  event.target.classList.remove('resizing');
});
