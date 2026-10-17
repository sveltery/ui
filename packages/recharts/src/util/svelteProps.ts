import type { Snippet } from 'svelte';
import type { Getter } from '../state/hooks.svelte.js';
import type { DisallowExtraKeys, RequiresDefaultProps } from './resolveDefaultProps.js';

/** The public props of a recharts component in Svelte: `class` replaces `className`, and children is a snippet. */
export type SvelteProps<P> = Omit<P, 'className' | 'children'> & { class?: string; children?: Snippet };

/** A recharts prop bag as the shell's components read it: React names, with a snippet for children. */
export type RechartsBag<P> = Omit<P, 'children'> & { children?: Snippet };

/** The argument a user snippet receives: the props recharts would pass to the element, with `class` for `className`. */
export type SvelteArgs<P> = Omit<P, 'className'> & { class?: string };

const rename = (key: string | symbol): string | symbol => (key === 'class' ? 'className' : key);

/**
 * Reads a component's `$props()` the way upstream reads its props after `resolveDefaultProps`:
 * `className` reads `class`, and an undefined prop reads its default. Every read goes back to `raw`, so an effect
 * that reads one prop re-runs only when that prop changes. Pass `() => props` for `raw`. Applying it to its own
 * result is safe, which lets PieChart resolve its defaults and PolarChart resolve the shared ones on top.
 */
export function rechartsProps<P extends object, D extends Partial<P>>(
  raw: Getter<SvelteProps<P> | RechartsBag<P> | P>,
  defaults: D & DisallowExtraKeys<P, D>,
): RequiresDefaultProps<RechartsBag<P>, D> {
  const source = raw as Getter<Record<PropertyKey, unknown>>;
  const fallback = defaults as Record<PropertyKey, unknown>;
  const read = (key: PropertyKey): unknown => {
    if (key === 'class') return undefined;
    const props = source();
    const value = key === 'className' ? (props.class ?? props.className) : props[key];
    return value === undefined ? fallback[key] : value;
  };
  const keys = (): Array<string | symbol> => [...new Set([...Reflect.ownKeys(source()).map(rename), ...Object.keys(fallback)])];
  return new Proxy({} as RequiresDefaultProps<RechartsBag<P>, D>, {
    get: (_, key) => read(key),
    has: (_, key) => keys().includes(key),
    ownKeys: () => keys(),
    getOwnPropertyDescriptor: (_, key) => (keys().includes(key) ? { value: read(key), enumerable: true, configurable: true, writable: false } : undefined),
  });
}

/** The reverse edge, for snippet arguments: `className` becomes `class`. */
export function svelteProps<P extends object>(bag: P): SvelteArgs<P> {
  if (!('className' in bag)) return bag as SvelteArgs<P>;
  const { className, ...rest } = bag as P & { className?: unknown };
  return { ...rest, class: className == null ? undefined : String(className) } as SvelteArgs<P>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- any function, whatever its parameters
type AnyFunction = (...args: any[]) => unknown;

/**
 * Upstream's element-or-render-function props as Svelte takes them: the function and element forms become one snippet,
 * which receives the props upstream would clone into the element. Objects and booleans keep their upstream meaning.
 * `S` maps each such prop to the props its snippet receives.
 */
export type WithSnippets<P, S extends { [K in keyof P]?: object }> = Omit<P, keyof S> & {
  [K in keyof S]?: Exclude<P[K & keyof P], AnyFunction | { type: unknown; props: unknown; key: unknown }> | Snippet<[SvelteArgs<S[K]>]>;
};
