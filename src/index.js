import { addResizeListener } from './detect-element-resize-by-scroll';

function main() {
  document.getElementById('app').appendChild(
    Array(1000).fill(null).map(() => {
      const div = document.createElement('div');
      div.classList.add('foo');
      div.innerHTML = '<div contenteditable="true">AAA</div>';
      return div;
    }).reduce((df, div) => {
      df.appendChild(div);
      return df;
    }, document.createDocumentFragment())
  );

  document.querySelectorAll('.foo').forEach((it) => {
    addResizeListener(it, () => {
      console.log('resize');
    });
  });
}

main();
