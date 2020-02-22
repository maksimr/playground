import { addResizeListener } from './detect-element-resize-by-object';

function main() {
  addResizeListener(document.getElementById('app'), () => {
    console.log('resize');
  });
}

main();
