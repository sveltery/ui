import { createContext, untrack, type Snippet } from 'svelte';
import type { GroupModel } from './item-state.svelte.js';
import type { CommandModel } from './root-state.svelte.js';

export const ANCHOR_PREFIX = 'cmdk-part:';

/**
 * Anything a container renders: an item, a group, a separator, Empty or Loading. The component that declares it
 * renders only an anchor comment in place. Its container renders `view`, so the ranked order and the unmounting are
 * done by Svelte's keyed `{#each}`.
 */
export interface Part {
  /** The declaring component's `$props.id()`, which also names its anchor comment. */
  readonly anchor: string;
  /** Registration order, which stands in for markup order until the anchors can be read. */
  readonly sequence: number;
  readonly kind: 'item' | 'group' | 'other';
  readonly view: Snippet;
}

/** The list sizer, or a group's items: the element whose children the command menu orders. */
export class Container {
  readonly root: CommandModel;
  readonly group: GroupModel | undefined;
  // eslint-disable-next-line svelte/prefer-svelte-reactivity -- filled while components initialize; `#version` is the reactive signal
  readonly #parts = new Set<Part>();
  /** Bumped when parts come and go, since `#parts` is filled while components initialize and may not be state. */
  #version = $state(0);

  constructor(root: CommandModel, group?: GroupModel) {
    this.root = root;
    this.group = group;
  }

  has(part: Part): boolean {
    return this.#parts.has(part);
  }

  /** Returns the unregister. */
  register(part: Part): () => void {
    this.#parts.add(part);
    return () => {
      this.#parts.delete(part);
      this.touch();
    };
  }

  touch(): void {
    untrack(() => (this.#version += 1));
  }

  parts = $derived.by(() => {
    void this.#version;
    return this.root.arrange(this, [...this.#parts]);
  });
}

const [getContainer, setContainer, hasContainer] = createContext<Container | undefined>();
export { setContainer };

/**
 * Registers a part with the container it sits in, and with Root through `register`. Call it while the component
 * initializes, so that the server renders the part too. Returns the container, or undefined when the part sits outside
 * one and renders in place.
 */
export function usePart(root: CommandModel, part: Part, register?: () => () => void): Container | undefined {
  const container = hasContainer() ? getContainer() : undefined;
  const unregister = [register?.(), container?.register(part)];
  $effect.pre(() => {
    root.relayout();
    container?.touch();
    return () => unregister.forEach((release) => release?.());
  });
  return container;
}
