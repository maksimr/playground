import { h } from 'preact';
import css from './Issue.css';

export function Issue(issue) {
  return h('tr', {className: css.issue},
    h('td', {className: css.issueId}, issue.idReadable),
    h('td', null, issue.summary));
}
