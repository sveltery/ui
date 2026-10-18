<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useChartHeight, useChartWidth } from '../context/chartLayoutContext.svelte.js';
  import { useAccessibilityLayer } from '../context/accessibilityContext.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectBrushDimensions } from '../state/selectors/brushSelectors.js';
  import { isPositiveNumber } from '../util/isWellBehavedNumber.js';
  import AllZIndexPortals from '../zIndex/AllZIndexPortals.svelte';
  import Surface from './Surface.svelte';

  type RootSurfaceProps = {
    children: Snippet;
    title: string | undefined;
    desc: string | undefined;
    otherAttributes: Record<string, unknown> | null;
    ref?: SVGSVGElement | null;
  };

  let { children, title, desc, otherAttributes, ref = $bindable(null) }: RootSurfaceProps = $props();

  const FULL_WIDTH_AND_HEIGHT = {
    width: '100%',
    height: '100%',
    // An inline svg leaves room for descenders below it, which grows a responsive chart on every render.
    display: 'block',
  };

  const isPanorama = useIsPanorama();
  const width = useChartWidth();
  const height = useChartHeight();
  const hasAccessibilityLayer = useAccessibilityLayer();
  const brushDimensions = useAppSelector(selectBrushDimensions);

  const tabIndex = $derived.by(() => {
    if (otherAttributes == null) return undefined;
    if (typeof otherAttributes.tabIndex === 'number') return otherAttributes.tabIndex;
    return hasAccessibilityLayer.current ? 0 : undefined;
  });
  const role = $derived.by(() => {
    if (otherAttributes == null) return undefined;
    if (typeof otherAttributes.role === 'string') return otherAttributes.role;
    return hasAccessibilityLayer.current ? 'application' : undefined;
  });
</script>

{#if isPanorama}
  {#if brushDimensions.current}
    <Surface width={brushDimensions.current.width} height={brushDimensions.current.height} x={brushDimensions.current.x} y={brushDimensions.current.y}>
      <AllZIndexPortals isPanorama>{@render children()}</AllZIndexPortals>
    </Surface>
  {/if}
{:else if isPositiveNumber(width.current) && isPositiveNumber(height.current)}
  <Surface {...otherAttributes} {title} {desc} {role} {tabIndex} width={width.current} height={height.current} style={FULL_WIDTH_AND_HEIGHT} bind:ref>
    <AllZIndexPortals isPanorama={false}>{@render children()}</AllZIndexPortals>
  </Surface>
{/if}
