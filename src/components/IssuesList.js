import { h } from 'preact';
import { Issue } from './Issue';
import css from './IssuesList.css';

export function IssuesList(issues) {
  return h('div', {className: css.issuesList},
    issues ? issues.map(Issue) : null
  );
}