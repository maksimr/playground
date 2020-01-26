const react = require('react');
const e = react.createElement;
const render = require('react-dom').render;
const div = e(function() {
  const [count, setState] = react.useState(0);
  return e('span');
});
render(div, document.body);
