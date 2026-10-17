<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { RadialBarSectorProps } from '../util/RadialBarUtils.js';
  import type { Props as SectorProps } from '../shape/Sector.js';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import type { RadialBarProps as UpstreamProps } from './RadialBar.js';

  /** RadialBar's public props: shape, activeShape and background take a snippet where upstream takes an element or a render function. */
  export type RadialBarProps = Omit<
    SvelteProps<WithSnippets<UpstreamProps, { shape: RadialBarSectorProps; activeShape: RadialBarSectorProps; background: SectorProps }>>,
    'label'
  > & {
    label?: ImplicitLabelListType;
  };
</script>

<script lang="ts">
  import { rechartsProps } from '../util/svelteProps.js';
  import { getNormalizedStackId } from '../util/ChartUtils.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetPolarGraphicalItem from '../state/SetPolarGraphicalItem.svelte';
  import { defaultRadialBarProps, type PropsWithDefaults } from './RadialBar.js';
  import SetRadialBarPayloadLegend from './SetRadialBarPayloadLegend.svelte';
  import RadialBarImpl from './RadialBarImpl.svelte';

  let raw: RadialBarProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultRadialBarProps>(() => raw as UpstreamProps, defaultRadialBarProps);
</script>

<RegisterGraphicalItemId id={resolved.id} type="radialBar">
  {#snippet children(id)}
    <SetPolarGraphicalItem
      type="radialBar"
      {id}
      data={undefined}
      dataKey={resolved.dataKey}
      hide={resolved.hide ?? defaultRadialBarProps.hide}
      angleAxisId={resolved.angleAxisId ?? defaultRadialBarProps.angleAxisId}
      radiusAxisId={resolved.radiusAxisId ?? defaultRadialBarProps.radiusAxisId}
      stackId={getNormalizedStackId(resolved.stackId)}
      barSize={resolved.barSize}
      minPointSize={resolved.minPointSize}
      maxBarSize={resolved.maxBarSize}
    />
    <SetRadialBarPayloadLegend legendType={resolved.legendType} />
    <RadialBarImpl {...resolved as unknown as Omit<PropsWithDefaults, 'children'>} {id} />
  {/snippet}
</RegisterGraphicalItemId>
