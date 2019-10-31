window.customElements.define('x-icon', class IconElement extends HTMLElement {
  connectedCallback() {
    this.updateIcon();
  }

  attributeChangedCallback(attrName: string) {
    if (attrName === 'src') {
      this.updateIcon();
    }
  }

  updateIcon() {
    this.innerHTML = this.getAttribute('src');
  }
});
