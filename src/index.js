module.exports = require('angular').module('app', [])
  .factory('foo', function() {
    const A = 'A';
    return function() {
      var start = Date.now();
      var time = start;
      while (time < (start + (5 * 1000))) {
        time = Date.now();
      }
      return A;
    };
  });