<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import { adaptEventsOfChild } from '../util/types.js';
  import { svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { parseCornerRadius, type RadialBarSectorProps } from '../util/RadialBarUtils.js';
  import { getZIndexFromUnknown } from '../zIndex/getZIndexFromUnknown.js';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import RadialBarSector from '../util/RadialBarSector.svelte';
  import type { InternalProps, RadialBarDataItem } from './RadialBar.js';
  import SectorsWithAnimation from './RadialBarSectorsWithAnimation.svelte';

  let props: InternalProps & { children?: Snippet } = $props();

  function backgroundProps(entry: RadialBarDataItem, i: number): RadialBarSectorProps | null {
    const { background } = entry;
    const rest = omit(entry, ['value', 'background']);
    if (!background) {
      return null;
    }
    const backgroundProps = svgPropertiesNoEventsFromUnknown(props.background);
    return {
      cornerRadius: parseCornerRadius(props.cornerRadius),
      ...rest,
      fill: '#eee',
      ...background,
      ...backgroundProps,
      ...adaptEventsOfChild(props, entry, i),
      index: i,
      className: clsx('recharts-radial-bar-background-sector', String(backgroundProps?.className)),
      option: background,
      isActive: false,
    } as RadialBarSectorProps;
  }
</script>

{#snippet Background(sectors: ReadonlyArray<RadialBarDataItem> | undefined)}
  {#if sectors != null}
    <ZIndexLayer zIndex={getZIndexFromUnknown(props.background, DefaultZIndexes.barBackground)}>
      {#each sectors as entry, i (`background-${entry.cx}-${entry.cy}-${entry.innerRadius}-${entry.outerRadius}-${entry.startAngle}-${entry.endAngle}-${i}`)}
        {const sectorProps = $derived(backgroundProps(entry, i))}
        {#if sectorProps}
          <RadialBarSector {...sectorProps} />
        {/if}
      {/each}
    </ZIndexLayer>
  {/if}
{/snippet}

{#if !props.hide}
  <ZIndexLayer zIndex={props.zIndex}>
    <Layer class={clsx('recharts-area', props.className)}>
      {#if props.background}
        <Layer class="recharts-radial-bar-background">{@render Background(props.sectors)}</Layer>
      {/if}
      <Layer class="recharts-radial-bar-sectors">
        <SectorsWithAnimation {props} />
      </Layer>
    </Layer>
  </ZIndexLayer>
{/if}
