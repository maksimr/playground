module.exports = function(config) {
  const webpack = require('webpack');
  process.env.CHROME_BIN = require('puppeteer').executablePath();

  config.set({
    frameworks: ['jasmine'],
    files: ['src/**/*.test.js'],
    plugins: [
      'karma-*',
      {
        'launcher:Puppeteer': ['type', function(/* baseBrowserDecorator */ baseBrowserDecorator, /* args */ args) {
          const ChromeHeadless = require('karma-chrome-launcher')['launcher:ChromeHeadless'][1];
          ChromeHeadless.apply(this, arguments);

          let browser = null;
          let screenshots = {};
          this._start = async (url) => {
            const puppeteer = require('puppeteer');
            browser = await puppeteer.launch({args: this._getOptions('')});
            const page = await browser.newPage();
            await page.exposeFunction('setViewport', (options) => {
              page.setViewport(options);
            });
            await page.exposeFunction('screenshot', async (options) => {
              const crypto = require('crypto');
              const id = crypto.randomBytes(16).toString('hex');
              screenshots[id] = await page.screenshot(options);
              return id;
            });
            await page.exposeFunction('toMatchImageSnapshot', (screenshotId, options) => compare(screenshots[screenshotId], options));
            await page.goto(url);
          };

          this.on('kill', async (done) => {
            if (browser != null) {
              console.log('Closing puppeteer browser.');
              await browser.close();
              screenshots = null;
              browser = null;
            }
            done();
          });
        }],
        'preprocessor:webpack': ['factory', function( /* config.basePath */ basePath) {
          const path = require('path');
          const config = require('./webpack.config');
          const tmpdir = require('os').tmpdir();
          return (content, file, done) => {
            const relativePath = path.relative(basePath, file.path);
            const output = require('path').join(tmpdir, relativePath);
            webpack(Object.assign({}, config, {
              entry: file.contentPath,
              output: {
                path: path.dirname(output),
                filename: path.basename(output)
              }
            }), (err) => {
              return err ? done(err) : require('fs').readFile(output, (err, content) => {
                done(err, content && content.toString());
              });
            });
          };
        }]
      }
    ],
    preprocessors: {
      'src/**/*.test.js': ['webpack']
    },
    reporters: ['progress'],
    autoWatch: true,
    browsers: ['Puppeteer'],
    singleRun: true
  });
};


function compare(actual, {
  currentSpec,
  customDiffConfig = {},
  customSnapshotsDir,
  customDiffDir,
  diffDirection = 'horizontal',
  failureThreshold = 0,
  failureThresholdType = 'pixel',
  updatePassedSnapshot = false,
  blur = 0,
  runInProcess = false,
  allowSizeMismatch = false,
  comparisonMethod = 'pixelmatch'
} = {}) {
  const SNAPSHOTS_DIR = '__image_snapshots__';
  const {diffImageToSnapshot, runDiffImageToSnapshot} = require('jest-image-snapshot/src/diff-snapshot');
  const updateSnapshot = process.argv.find((arg) => /^\s*(--updateSnapshot|-u)\s*$/.test(arg));
  const path = require('path');
  const testPath = __filename;
  const snapshotIdentifier = currentSpec.fullName.replace(/\s+/g, '_');
  const snapshotsDir = customSnapshotsDir || path.join(path.dirname(testPath), SNAPSHOTS_DIR);
  const diffDir = customDiffDir || path.join(snapshotsDir, '__diff_output__');
  const imageToSnapshot = runInProcess ? diffImageToSnapshot : runDiffImageToSnapshot;

  const result = imageToSnapshot({
    receivedImageBuffer: actual,
    snapshotsDir,
    diffDir,
    diffDirection,
    snapshotIdentifier,
    updateSnapshot: updateSnapshot,
    customDiffConfig: Object.assign({}, customDiffConfig),
    failureThreshold,
    failureThresholdType,
    updatePassedSnapshot,
    blur,
    allowSizeMismatch,
    comparisonMethod
  });


  let pass = true;
  let message = '';
  if (!result.updated && !result.added) {
    ({pass} = result);
    if (!pass) {
      const differencePercentage = result.diffRatio * 100;
      message = (result.diffSize && !allowSizeMismatch ?
        `Expected image to be the same size as the snapshot (${result.imageDimensions.baselineWidth}x${result.imageDimensions.baselineHeight}), but was different (${result.imageDimensions.receivedWidth}x${result.imageDimensions.receivedHeight}).\n` :
        `Expected image to match or be a close match to snapshot but was ${differencePercentage}% different from snapshot (${result.diffPixelCount} differing pixels).\n`)
        + `${('See diff for details:')} ${(result.diffOutputPath)}`;
    }
  }
  return {
    message,
    pass
  };
}