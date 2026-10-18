<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { omit } from 'es-toolkit';
  import type { DotItemDotProps, DotType } from '../util/types.js';
  import { isClipDot } from '../util/ReactUtils.js';
  import { svgPropertiesAndEventsFromUnknown } from '../util/svgPropertiesAndEvents.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import Layer from '../container/Layer.svelte';
  import Dot from '../shape/Dot.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { shouldRenderDots, type DotPoint, type DotsProps } from './Dots.js';

  let { points, dot, className, dotClassName, dataKey, baseProps, needClip, clipPathId, zIndex = DefaultZIndexes.scatter }: DotsProps = $props();

  const clipDot = $derived(isClipDot(dot));
  const customDotProps = $derived(svgPropertiesAndEventsFromUnknown(dot));

  function dotProps(entry: DotPoint, i: number): DotItemDotProps {
    return {
      r: 3,
      ...baseProps,
      ...customDotProps,
      index: i,
      cx: entry.x ?? undefined,
      cy: entry.y ?? undefined,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points,
    } as DotItemDotProps;
  }

  const clipPath = $derived(needClip && clipPathId != null ? `url(#clipPath-${clipDot ? '' : 'dots-'}${clipPathId})` : undefined);
</script>

{#snippet DotItem(option: DotType, dotProps: DotItemDotProps, className: string)}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={dotProps} />
  {:else}
    <Dot {...omit(dotProps ?? {}, ['points'])} class={clsx(className, typeof option !== 'boolean' ? (option as { className?: string }).className : '')} />
  {/if}
{/snippet}

{#if shouldRenderDots(points, dot)}
  <ZIndexLayer {zIndex}>
    <Layer class={className} {clipPath}>
      {#each points as entry, i (i)}
        {@render DotItem(dot, dotProps(entry, i), dotClassName)}
      {/each}
    </Layer>
  </ZIndexLayer>
{/if}
