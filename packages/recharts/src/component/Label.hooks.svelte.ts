import { createContext, type Snippet } from 'svelte';
import type { Box } from '../state/hooks.svelte.js';
import { useAppSelector } from '../state/hooks.svelte.js';
import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors.js';
import { useViewBox } from '../context/chartLayoutContext.svelte.js';
import { cartesianViewBoxToTrapezoid } from '../context/chartLayoutContext.js';
import { isNumOrStr } from '../util/DataUtils.js';
import type { DataKey, PolarViewBoxRequired, TrapezoidViewBox, ViewBox } from '../util/types.js';
import type { SvelteArgs, SvelteProps, WithSnippets } from '../util/svelteProps.js';
import { isLabelContentAFunction, type Props } from './Label.js';
import type { RenderableText } from './Text.js';

/** Label's public props: `content` is a snippet, and the text is a value, as in upstream's types. */
export type LabelProps = Omit<SvelteProps<WithSnippets<Props, { content: Props }>>, 'children'> & { children?: RenderableText };

/** Upstream's ImplicitLabelType, with a snippet where upstream takes an element or a render function. */
export type ImplicitLabelType = boolean | string | number | Snippet<[SvelteArgs<Props>]> | (LabelProps & { dataKey?: DataKey<unknown> });

const [getCartesianLabelContext, setCartesianLabelContext, hasCartesianLabelContext] = createContext<Box<TrapezoidViewBox>>();
const [getPolarLabelContext, setPolarContext, hasPolarLabelContext] = createContext<Box<PolarViewBoxRequired>>();

export { setCartesianLabelContext };

// A declared signature, so the emitted types name PolarViewBoxRequired instead of the private interface behind it.
export function setPolarLabelContext(context: Box<PolarViewBoxRequired>): Box<PolarViewBoxRequired> {
  return setPolarContext(context);
}

/** Must be called during component initialisation. */
export const useCartesianLabelContext = (): Box<TrapezoidViewBox | undefined> => {
  const labelChildContext = hasCartesianLabelContext() ? getCartesianLabelContext() : undefined;
  const chartContext = useViewBox();
  return {
    get current() {
      const chartViewBox = chartContext.current;
      return labelChildContext?.current || (chartViewBox ? cartesianViewBoxToTrapezoid(chartViewBox) : undefined);
    },
  };
};

/** Must be called during component initialisation. */
export const usePolarLabelContext = (): Box<PolarViewBoxRequired | undefined> => {
  const labelChildContext = hasPolarLabelContext() ? getPolarLabelContext() : undefined;
  const chartContext = useAppSelector(selectPolarViewBox);
  return {
    get current() {
      return labelChildContext?.current || chartContext.current;
    },
  };
};

/**
 * Upstream's parseLabel, which returns a Label element: here it returns the props of that Label, or null for none.
 * A Label element passed as `label` cannot exist in Svelte, so its branch is gone.
 */
export function parseLabel(label: ImplicitLabelType | undefined, viewBox: ViewBox | undefined, labelRef?: Props['labelRef']): LabelProps | null {
  if (!label) {
    return null;
  }
  const commonProps = { viewBox, labelRef };
  if (label === true) {
    return commonProps;
  }
  if (isNumOrStr(label)) {
    return { value: label, ...commonProps };
  }
  if (isLabelContentAFunction(label)) {
    return { content: label as Snippet<[SvelteArgs<Props>]>, ...commonProps };
  }
  if (label && typeof label === 'object') {
    return { ...label, ...commonProps };
  }
  return null;
}
