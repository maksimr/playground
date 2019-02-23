require('angular');
require('angular-mocks/angular-mocks.js');

var __karmaWebpackManifest__ = [];
var testsContext = require.context('../src', true, /.*Test\.js$/);
var runnable = testsContext.keys().filter(path => __karmaWebpackManifest__.indexOf(path) >= 0);
if (!runnable.length) runnable = testsContext.keys();
runnable.forEach(testsContext);
