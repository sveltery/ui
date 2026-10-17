<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import type { BarShapeProps, Props as UpstreamProps } from './Bar.js';

  /** Bar's public props: shape, activeBar and background take a snippet where upstream takes an element or a render function. */
  export type BarProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { shape: BarShapeProps; activeBar: BarShapeProps; background: BarShapeProps }>>, 'label'> & {
    label?: ImplicitLabelListType;
  };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetLegendPayload from '../state/SetLegendPayload.svelte';
  import SetCartesianGraphicalItem from '../state/SetCartesianGraphicalItem.svelte';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { computeLegendPayloadFromBarData, defaultBarProps, type BarImplProps } from './Bar.js';
  import { useStackId } from './BarStack.hooks.js';
  import SetBarTooltipEntrySettings from './SetBarTooltipEntrySettings.svelte';
  import BarImpl from './BarImpl.svelte';

  let raw: BarProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultBarProps>(() => raw as UpstreamProps, defaultBarProps);
  const stackId = useStackId(() => resolved.stackId);
  const isPanorama = useIsPanorama();
  // Upstream builds the payload from a fresh props object on every render, so it is a snapshot of every prop.
  const legendPayload = $derived(computeLegendPayloadFromBarData({ ...resolved } as UpstreamProps));
</script>

<RegisterGraphicalItemId id={resolved.id} type="bar">
  {#snippet children(id)}
    <SetLegendPayload {legendPayload} />
    <SetBarTooltipEntrySettings
      dataKey={resolved.dataKey}
      stroke={resolved.stroke}
      strokeWidth={resolved.strokeWidth}
      fill={resolved.fill}
      name={resolved.name}
      hide={resolved.hide}
      unit={resolved.unit}
      tooltipType={resolved.tooltipType}
      {id}
    />
    <SetCartesianGraphicalItem
      type="bar"
      {id}
      data={undefined}
      xAxisId={resolved.xAxisId}
      yAxisId={resolved.yAxisId}
      zAxisId={0}
      dataKey={resolved.dataKey}
      stackId={stackId.current}
      hide={resolved.hide}
      barSize={resolved.barSize}
      minPointSize={resolved.minPointSize}
      maxBarSize={resolved.maxBarSize}
      isPanorama={isPanorama}
      hasCustomShape={resolved.shape != null}
    />
    <ZIndexLayer zIndex={resolved.zIndex}>
      <BarImpl {...resolved as unknown as BarImplProps} {id} />
    </ZIndexLayer>
  {/snippet}
</RegisterGraphicalItemId>
