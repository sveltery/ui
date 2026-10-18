import type { Attachment } from 'svelte/attachments';
import type { Ref } from '../react.js';

/** React's ref handling for a ref passed down as a prop: a callback gets the node, an object gets it in `current`. */
export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

/** Attaches a React-style ref to an element: set on insert, cleared on removal, like react-dom does. */
export function attachRef<T extends Element>(ref: Ref<T> | undefined): Attachment<T> {
  return (node) => {
    setRef(ref, node);
    return () => setRef(ref, null);
  };
}
