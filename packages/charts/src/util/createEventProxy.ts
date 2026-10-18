import { SyntheticEvent } from '../react.js';

export function createEventProxy<T extends SyntheticEvent>(reactEvent: T): T {
  const { currentTarget } = reactEvent;
  return new Proxy(reactEvent, {
    get: (target, prop) => {
      if (prop === 'currentTarget') {
        return currentTarget;
      }
      const value = Reflect.get(target, prop);
      if (typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    },
  });
}
