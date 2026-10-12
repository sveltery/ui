import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/**
 * Replaces a part's default element, like the `render` snippets of Sveltery Base.
 * Spread `props` onto the host element and render `children` inside it.
 */
export type RenderSnippet<State> = Snippet<[props: HTMLAttributes<HTMLElement>, state: State, children: Snippet | undefined]>;
