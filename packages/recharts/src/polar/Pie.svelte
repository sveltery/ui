<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { Props as CurveProps } from '../shape/Curve.js';
  import type { PieLabelRenderProps, PieSectorDataItem, PieSectorShapeProps, Props as UpstreamProps } from './Pie.js';

  /** Pie's public props: shape, activeShape, inactiveShape, label and labelLine take a snippet where upstream takes an element or a render function. */
  export type PieProps = SvelteProps<
    WithSnippets<
      UpstreamProps,
      { shape: PieSectorShapeProps; activeShape: PieSectorDataItem; inactiveShape: PieSectorDataItem; label: PieLabelRenderProps; labelLine: CurveProps }
    >
  >;
</script>

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { rechartsProps } from '../util/svelteProps.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import type { PiePresentationProps } from '../state/types/PieSettings.js';
  import { provideCellReader } from '../component/Cell.hooks.svelte.js';
  import RegisterGraphicalItemId from '../context/RegisterGraphicalItemId.svelte';
  import SetPolarGraphicalItem from '../state/SetPolarGraphicalItem.svelte';
  import { defaultPieProps, type InternalProps } from './Pie.js';
  import SetPiePayloadLegend from './SetPiePayloadLegend.svelte';
  import PieImpl from './PieImpl.svelte';

  let raw: PieProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultPieProps>(() => raw as UpstreamProps, defaultPieProps);
  const propsWithoutId = $derived(omit(resolved, ['id']));
  const presentationProps: PiePresentationProps | null = $derived(svgPropertiesNoEvents(propsWithoutId) as PiePresentationProps | null);
  // Upstream finds the Cell elements among its children. Cells rendered in this Pie's children register here instead.
  const cells = provideCellReader();
</script>

<RegisterGraphicalItemId id={resolved.id} type="pie">
  {#snippet children(id)}
    <SetPolarGraphicalItem
      type="pie"
      {id}
      data={propsWithoutId.data}
      dataKey={propsWithoutId.dataKey}
      hide={propsWithoutId.hide}
      angleAxisId={0}
      radiusAxisId={0}
      name={propsWithoutId.name}
      nameKey={propsWithoutId.nameKey}
      tooltipType={propsWithoutId.tooltipType}
      legendType={propsWithoutId.legendType}
      fill={propsWithoutId.fill}
      cx={propsWithoutId.cx}
      cy={propsWithoutId.cy}
      startAngle={propsWithoutId.startAngle}
      endAngle={propsWithoutId.endAngle}
      paddingAngle={propsWithoutId.paddingAngle}
      minAngle={propsWithoutId.minAngle}
      innerRadius={propsWithoutId.innerRadius}
      outerRadius={propsWithoutId.outerRadius}
      cornerRadius={propsWithoutId.cornerRadius}
      {presentationProps}
      maxRadius={resolved.maxRadius}
    />
    <SetPiePayloadLegend {id} cells={cells.current} />
    <PieImpl {...propsWithoutId as unknown as Omit<InternalProps, 'sectors' | 'children'>} {id} cells={cells.current} />
  {/snippet}
</RegisterGraphicalItemId>
