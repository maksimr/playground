module.exports = require('angular').module('app', [])
  .factory('foo', function() {
    const A = 'A';
    return function() {
      console.log('A');
      return A;
    };
  });