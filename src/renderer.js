import { h, render } from 'preact';
import { App } from './components/App';

export function renderApp(appState) {
  const appNode = document.getElementById('app');
  return render(h(App, appState), appNode, appNode.firstChild);
}
