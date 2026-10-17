<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import type { CellEntry } from '../component/Cell.hooks.svelte.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectPieSectors } from '../state/selectors/pieSelectors.js';
  import Layer from '../container/Layer.svelte';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import type { InternalProps, PieSectorDataItem } from './Pie.js';
  import SetPieTooltipEntrySettings from './SetPieTooltipEntrySettings.svelte';
  import SectorsWithAnimation from './PieSectorsWithAnimation.svelte';

  let { cells, ...props }: Omit<InternalProps, 'sectors'> & { cells: ReadonlyArray<CellEntry>; children?: Snippet } = $props();

  const sectors = useAppSelector((state) => selectPieSectors(state, props.id, cells));
  const previousSectorsRef: { current: ReadonlyArray<PieSectorDataItem> | null } = { current: null };
  const layerClass = $derived(clsx('recharts-pie', props.className));
  const propsWithoutId = $derived(omit(props, ['id']));

  $effect.pre(() => {
    if (props.hide || sectors.current == null) {
      previousSectorsRef.current = null;
    }
  });
</script>

{#if props.hide || sectors.current == null}
  <Layer tabIndex={props.rootTabIndex} class={layerClass} />
{:else}
  <ZIndexLayer zIndex={props.zIndex}>
    <SetPieTooltipEntrySettings
      dataKey={props.dataKey}
      nameKey={props.nameKey}
      sectors={sectors.current}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth}
      fill={props.fill}
      name={props.name}
      hide={props.hide}
      tooltipType={props.tooltipType}
      id={props.id}
      activeShape={props.activeShape}
    />
    <Layer tabIndex={props.rootTabIndex} class={layerClass}>
      <SectorsWithAnimation props={{ ...propsWithoutId, sectors: sectors.current }} {previousSectorsRef} id={props.id} />
    </Layer>
  </ZIndexLayer>
{/if}
