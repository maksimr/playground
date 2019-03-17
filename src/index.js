require('./components/icon/icon');

const Icon = window.customElements.get('p-icon');
const reqIcon = require.context('svg-inline-loader!@jetbrains/icons', false, /.*\.svg/);
reqIcon.keys().reduce((it, key) => {
  const iconName = require('path').basename(key, '.svg');
  Icon.addIcon(iconName, reqIcon(key));
  return it;
}, {});
