import angular from 'angular';

main();

function main() {
  const tElement = document.createElement('foo');
  tElement.setAttribute('ng-repeat', 'it in $root.items');
  document.getElementById('app').appendChild(tElement);
  tElement.innerText = '{{it}}';

  angular.bootstrap(document.getElementById('app'), [
    angular.module('app', [])
      .component('foo', {
        template: 'AAA'
      })
      .run(($rootScope) => {
        $rootScope.items = Array(1000).fill(null).map((_, it) => it);
      })
      .name
  ]);
}