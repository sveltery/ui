import { createContext, type Snippet } from 'svelte';
import type { Box } from '../state/hooks.svelte.js';
import type { SvelteArgs, SvelteProps, WithSnippets } from '../util/svelteProps.js';
import type { Props as LabelContentProps } from './Label.js';
import type { CartesianLabelListEntry, PolarLabelListEntry, Props } from './LabelList.js';

/** LabelList's public props: `content` is a snippet that receives what upstream passes to each label's content. */
export type LabelListProps = SvelteProps<WithSnippets<Props, { content: LabelContentProps }>>;

/** Upstream's ImplicitLabelListType, with a snippet where upstream takes an element or a render function. */
export type ImplicitLabelListType = boolean | Snippet<[SvelteArgs<LabelContentProps>]> | LabelListProps;

type Entries<T> = Box<ReadonlyArray<T> | undefined>;

const [getCartesianLabelListContext, setCartesianLabelListContext, hasCartesianLabelListContext] = createContext<Entries<CartesianLabelListEntry>>();
const [getPolarLabelListContext, setPolarLabelListContext, hasPolarLabelListContext] = createContext<Entries<PolarLabelListEntry>>();

export { setCartesianLabelListContext, setPolarLabelListContext };

const none: Box<undefined> = { current: undefined };

/** Must be called during component initialisation. */
export const useCartesianLabelListContext = (): Entries<CartesianLabelListEntry> => (hasCartesianLabelListContext() ? getCartesianLabelListContext() : none);

/** Must be called during component initialisation. */
export const usePolarLabelListContext = (): Entries<PolarLabelListEntry> => (hasPolarLabelListContext() ? getPolarLabelListContext() : none);
