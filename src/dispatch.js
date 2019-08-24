import { Subject } from 'rxjs';

const actions = new Subject();

export function onDispatch(observer) {
  return actions.subscribe(observer);
}

export function dispatch(fn) {
  actions.next(fn);
}
