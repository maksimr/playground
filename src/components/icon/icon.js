const css = require('style-loader!css-loader?modules!./icon.css');
const icons = {};

window.customElements.define('p-icon', class IconElement extends HTMLElement {
  static addIcon(iconName, icon) {
    icons[iconName] = icon;
  }

  connectedCallback() {
    this.classList.add(css.icon);
    this.updateIcon();
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'name' || attrName === 'size') {
      this.updateIcon();
    }
  }

  updateIcon() {
    const iconName = this.getAttribute('name');
    const iconSize = this.getAttribute('size');
    if (iconSize) {
      this.style.fontSize = iconSize + 'px';
    }
    this.innerHTML = icons[iconName] || '';
  }
});
