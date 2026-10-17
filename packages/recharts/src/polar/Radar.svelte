<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { ActiveDotProps, DotItemDotProps } from '../util/types.js';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import type { InternalRadarProps, Props as UpstreamProps } from './Radar.js';

  /** Radar's public props: shape, dot and activeDot take a snippet where upstream takes an element or a render function. */
  export type RadarProps = Omit<SvelteProps<WithSnippets<UpstreamProps, { shape: InternalRadarProps; dot: DotItemDotProps; activeDot: ActiveDotProps }>>, 'label'> & {
    label?: ImplicitLabelListType;
  };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetPolarGraphicalItem from '../state/SetPolarGraphicalItem.svelte';
  import SetPolarLegendPayload from '../state/SetPolarLegendPayload.svelte';
  import { computeLegendPayloadFromRadarSectors, defaultRadarProps, type PropsWithDefaults } from './Radar.js';
  import SetRadarTooltipEntrySettings from './SetRadarTooltipEntrySettings.svelte';
  import RadarImpl from './RadarImpl.svelte';

  let raw: RadarProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultRadarProps>(() => raw as UpstreamProps, defaultRadarProps);
  // Upstream builds the payload from a fresh props object on every render, so it is a snapshot of every prop.
  const legendPayload = $derived(computeLegendPayloadFromRadarSectors({ ...resolved } as PropsWithDefaults));
</script>

<RegisterGraphicalItemId id={resolved.id} type="radar">
  {#snippet children(id)}
    <SetPolarGraphicalItem type="radar" {id} data={undefined} dataKey={resolved.dataKey} hide={resolved.hide} angleAxisId={resolved.angleAxisId} radiusAxisId={resolved.radiusAxisId} />
    <SetPolarLegendPayload {legendPayload} />
    <SetRadarTooltipEntrySettings
      dataKey={resolved.dataKey}
      stroke={resolved.stroke}
      strokeWidth={resolved.strokeWidth}
      fill={resolved.fill}
      name={resolved.name}
      hide={resolved.hide}
      tooltipType={resolved.tooltipType}
      {id}
    />
    <RadarImpl {...resolved as unknown as Omit<PropsWithDefaults, 'children'>} {id} />
  {/snippet}
</RegisterGraphicalItemId>
