<script lang="ts">
  import { isNumber } from '../util/DataUtils.js';
  import { isPositiveNumber } from '../util/isWellBehavedNumber.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import type { Props } from './ResponsiveContainer.js';
  import { calculateChartDimensions, getDefaultWidthAndHeight } from './responsiveContainerUtils.js';
  import { useResponsiveContainerContext } from './ResponsiveContainer.hooks.js';
  import ResponsiveContainerContextProvider from './ResponsiveContainerContextProvider.svelte';
  import SizeDetectorContainer from './SizeDetectorContainer.svelte';

  let { ref = $bindable(null), ...raw }: SvelteProps<Props> & { ref?: HTMLDivElement | null } = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});
  const responsiveContainerContext = useResponsiveContainerContext();

  // A ResponsiveContainer inside another one has nothing to measure; the outer size wins.
  const insideSizedContainer = $derived(isPositiveNumber(responsiveContainerContext.current.width) && isPositiveNumber(responsiveContainerContext.current.height));
  const dimensions = $derived(getDefaultWidthAndHeight({ width: resolved.width, height: resolved.height, aspect: resolved.aspect }));
  // With fixed numbers for width and height there is nothing to measure either.
  const calculated = $derived(calculateChartDimensions(undefined, undefined, { width: dimensions.width, height: dimensions.height, aspect: resolved.aspect, maxHeight: resolved.maxHeight }));
</script>

{#if insideSizedContainer}
  {@render raw.children?.()}
{:else if isNumber(calculated.calculatedWidth) && isNumber(calculated.calculatedHeight)}
  <ResponsiveContainerContextProvider width={calculated.calculatedWidth} height={calculated.calculatedHeight}>
    {@render raw.children?.()}
  </ResponsiveContainerContextProvider>
{:else}
  <SizeDetectorContainer {...resolved} width={dimensions.width} height={dimensions.height} bind:ref />
{/if}
