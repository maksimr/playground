import { h } from 'preact';
import { IssuesList } from './IssuesList';
import css from './App.css';

export function App(appState) {
  return h('div', {className: css.app},
    IssuesList(appState.issues)
  );
}
