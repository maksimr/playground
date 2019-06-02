require('raw-loader!../index.html');

window.customElements.define('p-resizable-panels', class ResizablePanelsElement extends HTMLElement {
  connectedCallback() {
    this.childNodes.forEach((it) => {
      return it;
    });
  }
});
