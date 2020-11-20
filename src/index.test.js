jasmine.getEnv().addReporter(new class {
  specStarted(spec) {
    jasmine.getEnv().currentSpec = spec;
  }
  specDone() {
    jasmine.getEnv().currentSpec = null;
  }
}());

beforeAll(() => {
  jasmine.addAsyncMatchers({
    toMatchImageSnapshot: function() {
      return {
        async compare(actual, {
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
          return await window.toMatchImageSnapshot(actual, {
            currentSpec: jasmine.getEnv().currentSpec,
            customDiffConfig,
            customSnapshotsDir,
            customDiffDir,
            diffDirection,
            failureThreshold,
            failureThresholdType,
            updatePassedSnapshot,
            blur,
            runInProcess,
            allowSizeMismatch,
            comparisonMethod
          });
        }
      };
    }
  });
});

const {render} = require('react-dom');
const {createElement} = require('react');

describe('puppeteer', function() {
  it('should capture image snapshot', async function() {
    render(createElement('div', null, 'Hello React!'), document.body);

    const image = await window.screenshot();
    await expectAsync(image).toMatchImageSnapshot({
      updatePassedSnapshot: true
    });
  });
});
