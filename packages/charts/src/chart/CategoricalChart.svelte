<script lang="ts">
  import type { Snippet } from 'svelte';
  import { omit } from 'es-toolkit';
  import type { CartesianChartProps } from '../util/types.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import ReportChartSize from '../context/ReportChartSize.svelte';
  import RootSurface from '../container/RootSurface.svelte';
  import ClipPathProvider from '../container/ClipPathProvider.svelte';
  import RechartsWrapper from './RechartsWrapper.svelte';

  let { ref = $bindable(null), ...props }: Omit<CartesianChartProps, 'children'> & { children?: Snippet; ref?: SVGSVGElement | null } = $props();

  // compact is the panorama inside Brush, but it is a public prop, so it may render outside Brush too.
  const otherAttributes = $derived(svgPropertiesNoEvents(omit(props, ['width', 'height', 'responsive', 'children', 'className', 'style', 'compact', 'title', 'desc'])));
</script>

{#if props.compact}
  <ReportChartSize width={props.width} height={props.height}
  /><RootSurface {otherAttributes} title={props.title} desc={props.desc}>
    {@render props.children?.()}
  </RootSurface>
{:else}
  <RechartsWrapper
    className={props.className}
    style={props.style}
    width={props.width}
    height={props.height}
    responsive={props.responsive ?? false}
    onClick={props.onClick}
    onMouseLeave={props.onMouseLeave}
    onMouseEnter={props.onMouseEnter}
    onMouseMove={props.onMouseMove}
    onMouseDown={props.onMouseDown}
    onMouseUp={props.onMouseUp}
    onContextMenu={props.onContextMenu}
    onDoubleClick={props.onDoubleClick}
    onTouchStart={props.onTouchStart}
    onTouchMove={props.onTouchMove}
    onTouchEnd={props.onTouchEnd}
  >
    <RootSurface {otherAttributes} title={props.title} desc={props.desc} bind:ref>
      <ClipPathProvider>{@render props.children?.()}</ClipPathProvider>
    </RootSurface>
  </RechartsWrapper>
{/if}
