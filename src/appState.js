import { BehaviorSubject } from 'rxjs';
import { produce } from 'immer';

const appState = new BehaviorSubject({});

export function getCurrentAppState() {
  return appState.value;
}

export function onChangeAppState(observer) {
  return appState.subscribe(observer);
}

export function updateAppStateSync(fn) {
  appState.next(produce(appState.value, fn));
}
