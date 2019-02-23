module.exports = function(config) {
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    frameworks: ['jasmine'],
    files: [{
      pattern: 'test/test-bundle.webpack.js',
      watched: false
    }],
    preprocessors: [
      'test/test-bundle.webpack.js'
    ].reduce(function(preprocessors, fileMask) {
      preprocessors[fileMask] = ['webpack'];
      return preprocessors;
    }, {}),
    webpack: {
      mode: 'development',
      devtool: 'eval-source-map'
    },
    webpackServer: {},
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    autoWatch: true,
    singleRun: true
  });
};
