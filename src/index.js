import { updateAppStateSync, onChangeAppState, getCurrentAppState } from './appState';
import { dispatch, onDispatch } from './dispatch';
import { renderApp } from './renderer';

function main() {
  preloadAppState();
  extractBaseUrlAndUpdateState();
  onDispatch(updateAppStateSync);
  onChangeAppState(renderApp);

  fetchResource('/api/config?fields=version').then((data) => {
    dispatch((state) => {
      state.version = data.version;
    });
  });

  fetchResource('/api/issues?$top=2500&fields=idReadable,summary').then((data) => {
    dispatch((state) => {
      state.issues = data;
    });
  });


  function fetchResource(url) {
    const baseUrl = getCurrentAppState().baseUrl;
    return fetch(baseUrl + url).then(response => response.json());
  }


  function preloadAppState() {
    const appStateLocalStorageKey = 'appState';
    const appStateJson = localStorage.getItem(appStateLocalStorageKey);
    const appState = appStateJson ? JSON.parse(appStateJson) : null;
    if (appState) updateAppStateSync(() => appState);
    onChangeAppState((appState) => localStorage.setItem(appStateLocalStorageKey, JSON.stringify(appState)));
  }


  function extractBaseUrlAndUpdateState() {
    updateAppStateSync((state) => {
      const baseUrl = window.location.search.substr(1) || 'https://youtrack.jetbrains.com';
      if (baseUrl !== state.baseUrl) state.baseUrl = baseUrl;
    });
  }
}


main();
