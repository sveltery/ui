<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { ActiveDotProps, DotItemDotProps } from '../util/types.js';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import type { Props as UpstreamProps } from './Area.js';

  /** Area's public props: dot and activeDot take a snippet where upstream takes an element or a render function. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- upstream's defaults, so untyped data stays untyped
  export type AreaProps<DataPointType = any, ValueAxisType = any> = Omit<
    SvelteProps<WithSnippets<UpstreamProps<DataPointType, ValueAxisType>, { dot: DotItemDotProps; activeDot: ActiveDotProps }>>,
    'label'
  > & {
    label?: ImplicitLabelListType;
  };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { getNormalizedStackId } from '../util/ChartUtils.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetLegendPayload from '../state/SetLegendPayload.svelte';
  import SetCartesianGraphicalItem from '../state/SetCartesianGraphicalItem.svelte';
  import { computeLegendPayloadFromAreaData, defaultAreaProps } from './Area.js';
  import SetAreaTooltipEntrySettings from './SetAreaTooltipEntrySettings.svelte';
  import AreaImpl from './AreaImpl.svelte';

  type Upstream = UpstreamProps<unknown, unknown>;

  let raw: AreaProps = $props();
  const resolved = rechartsProps<Upstream, typeof defaultAreaProps>(() => raw as Upstream, defaultAreaProps);
  const isPanorama = useIsPanorama();
  // Upstream builds the payload from a fresh props object on every render, so it is a snapshot of every prop.
  const legendPayload = $derived(computeLegendPayloadFromAreaData({ ...resolved } as Upstream));
</script>

<RegisterGraphicalItemId id={resolved.id} type="area">
  {#snippet children(id)}
    <SetLegendPayload {legendPayload} />
    <SetAreaTooltipEntrySettings
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
      type="area"
      {id}
      data={resolved.data}
      dataKey={resolved.dataKey}
      xAxisId={resolved.xAxisId}
      yAxisId={resolved.yAxisId}
      zAxisId={0}
      stackId={getNormalizedStackId(resolved.stackId)}
      hide={resolved.hide}
      barSize={undefined}
      baseValue={resolved.baseValue}
      {isPanorama}
      connectNulls={resolved.connectNulls}
    />
    <AreaImpl {...resolved} {id} />
  {/snippet}
</RegisterGraphicalItemId>
