/**
 * Copies the plain objects and arrays of a value that is about to enter the store. Immer freezes what enters the
 * state, and freezing a Svelte $state proxy throws. Read inside an effect, the copy also subscribes that effect to
 * every nested field, so mutating the caller's $state dispatches again. Functions, DOM nodes, class instances and
 * frozen values (already store-owned) are kept by reference.
 */
export function toStoreValue<T>(value: T, copies = new Map<object, unknown>()): T {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  const known = copies.get(value);
  if (known !== undefined) return known as T;
  if (Array.isArray(value)) {
    const copy: unknown[] = [];
    copies.set(value, copy);
    for (const item of value) copy.push(toStoreValue(item, copies));
    return copy as T;
  }
  if (Object.getPrototypeOf(value) !== Object.prototype) return value;
  const copy: Record<string, unknown> = {};
  copies.set(value, copy);
  for (const [key, item] of Object.entries(value)) copy[key] = toStoreValue(item, copies);
  return copy as T;
}
