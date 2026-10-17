<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { ActiveDotProps, DotItemDotProps } from '../util/types.js';
  import type { Props as CurveProps } from '../shape/Curve.js';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import type { Props as UpstreamProps } from './Line.js';

  /** Line's public props: dot, activeDot and shape take a snippet where upstream takes an element or a render function. */
  export type LineProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { dot: DotItemDotProps; activeDot: ActiveDotProps; shape: CurveProps }>>, 'label'> & {
    label?: ImplicitLabelListType;
  };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetLegendPayload from '../state/SetLegendPayload.svelte';
  import SetCartesianGraphicalItem from '../state/SetCartesianGraphicalItem.svelte';
  import { computeLegendPayloadFromAreaData, defaultLineProps } from './Line.js';
  import SetLineTooltipEntrySettings from './SetLineTooltipEntrySettings.svelte';
  import LineImpl from './LineImpl.svelte';

  let raw: LineProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultLineProps>(() => raw as UpstreamProps, defaultLineProps);
  const isPanorama = useIsPanorama();
  // Upstream builds the payload from a fresh props object on every render, so it is a snapshot of every prop.
  const legendPayload = $derived(computeLegendPayloadFromAreaData({ ...resolved } as UpstreamProps));
</script>

<RegisterGraphicalItemId id={resolved.id} type="line">
  {#snippet children(id)}
    <SetLegendPayload {legendPayload} />
    <SetLineTooltipEntrySettings
      dataKey={resolved.dataKey}
      data={resolved.data}
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
      type="line"
      {id}
      data={resolved.data}
      xAxisId={resolved.xAxisId}
      yAxisId={resolved.yAxisId}
      zAxisId={0}
      dataKey={resolved.dataKey}
      hide={resolved.hide}
      {isPanorama}
    />
    <LineImpl {...resolved} {id} />
  {/snippet}
</RegisterGraphicalItemId>
