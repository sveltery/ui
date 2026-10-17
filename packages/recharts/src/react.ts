// scripts/sync-upstream.mjs points recharts' imports from react here, so the vendored code reads in Svelte and DOM terms.
import type { Snippet } from 'svelte';
import type { AriaAttributes as SvelteAriaAttributes, DOMAttributes, SVGAttributes as SvelteSVGAttributes } from 'svelte/elements';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TrustedHTML {}
}

export type Key = string | number | bigint;

export type ReactNode = Snippet | string | number | bigint | boolean | null | undefined | Iterable<ReactNode>;

export type ReactElement<P = any> = { type: unknown; props: P; key: Key | null };

export type FunctionComponent<P = object> = ((props: P) => ReactNode) & { displayName?: string };

export type Component<P = object> = { props: P };

export function isValidElement<P>(_value: unknown): _value is ReactElement<P> {
  return false;
}

export type CSSProperties = { [property: string]: string | number | undefined };

type CamelCase<S extends string> = S extends `${'aria' | 'data'}-${string}`
  ? S
  : S extends `${infer Head}${'-' | ':'}${infer Tail}`
    ? `${Head}${Capitalize<CamelCase<Tail>>}`
    : S;

type SvgAttributes = Omit<SvelteSVGAttributes<EventTarget>, keyof DOMAttributes<EventTarget> | 'class' | 'style' | 'tabindex'> & { style?: CSSProperties; tabIndex?: number };

// React names SVG attributes in camelCase (strokeWidth for stroke-width), and recharts' props follow it. React's types have no null values.
export type SVGAttributes<_T = unknown> = { [K in keyof SvgAttributes as K extends string ? CamelCase<K> : K]: Exclude<SvgAttributes[K], null> };

export type SVGProps<T = unknown> = SVGAttributes<T>;

export type AriaAttributes = SvelteAriaAttributes;

export type RefObject<T> = { current: T };

export type Ref<T> = RefObject<T | null> | ((instance: T | null) => void) | null;

export type PropsWithoutRef<P> = Omit<P, 'ref'>;

type WithCurrentTarget<T, E extends Event> = E & { currentTarget: EventTarget & T };

export type SyntheticEvent<T = Element, E extends Event = Event> = WithCurrentTarget<T, E>;
export type UIEvent<T = Element, E extends Event = globalThis.UIEvent> = WithCurrentTarget<T, E>;
export type FormEvent<T = Element, E extends Event = Event> = WithCurrentTarget<T, E>;
export type MouseEvent<T = Element, E extends Event = globalThis.MouseEvent> = WithCurrentTarget<T, E>;
export type PointerEvent<T = Element, E extends Event = globalThis.PointerEvent> = WithCurrentTarget<T, E>;
export type TouchEvent<T = Element, E extends Event = globalThis.TouchEvent> = WithCurrentTarget<T, E>;
export type KeyboardEvent<T = Element, E extends Event = globalThis.KeyboardEvent> = WithCurrentTarget<T, E>;
export type FocusEvent<T = Element, E extends Event = globalThis.FocusEvent> = WithCurrentTarget<T, E>;
export type DragEvent<T = Element, E extends Event = globalThis.DragEvent> = WithCurrentTarget<T, E>;
export type WheelEvent<T = Element, E extends Event = globalThis.WheelEvent> = WithCurrentTarget<T, E>;
export type ClipboardEvent<T = Element, E extends Event = globalThis.ClipboardEvent> = WithCurrentTarget<T, E>;
export type CompositionEvent<T = Element, E extends Event = globalThis.CompositionEvent> = WithCurrentTarget<T, E>;
export type AnimationEvent<T = Element, E extends Event = globalThis.AnimationEvent> = WithCurrentTarget<T, E>;
export type TransitionEvent<T = Element, E extends Event = globalThis.TransitionEvent> = WithCurrentTarget<T, E>;
