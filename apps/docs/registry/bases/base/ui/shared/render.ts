import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/**
 * Replaces a part's default element, like the `render` snippets of Sveltery Base.
 * Spread `props` onto the host element and render `children` inside it.
 * `Host` is the element the part renders by default, so its typed event handlers carry over.
 */
export type RenderSnippet<State, Host extends HTMLElement = HTMLElement> = Snippet<[props: HTMLAttributes<Host>, state: State, children: Snippet | undefined]>;
