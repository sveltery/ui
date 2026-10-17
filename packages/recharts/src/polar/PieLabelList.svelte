<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { polarToCartesian } from '../util/PolarUtils.js';
  import { getValueByDataKey } from '../util/ChartUtils.js';
  import { svgPropertiesNoEvents, svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import { getClassNameFromUnknown } from '../util/getClassNameFromUnknown.js';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import Layer from '../container/Layer.svelte';
  import Curve from '../shape/Curve.svelte';
  import type { Props as CurveProps } from '../shape/Curve.js';
  import Text from '../component/Text.svelte';
  import type { Props as TextProps } from '../component/Text.js';
  import RenderProp from '../util/RenderProp.svelte';
  import LabelListFromLabelProp from '../component/LabelListFromLabelProp.svelte';
  import type { ImplicitLabelListType } from '../component/LabelList.hooks.svelte.js';
  import { getTextAnchor, type InternalProps, type PieLabelRenderProps, type PieSectorDataItem } from './Pie.js';

  let { sectors, props, showLabels }: { sectors: ReadonlyArray<PieSectorDataItem>; props: Omit<InternalProps, 'id'>; showLabels: boolean } = $props();

  // Upstream's PieLabels: one label and label line per sector.
  const labels = $derived.by(() => {
    const { label, labelLine } = props;
    if (!showLabels || !label || !sectors) {
      return null;
    }
    const pieProps = svgPropertiesNoEvents(props);
    const customLabelProps = svgPropertiesNoEventsFromUnknown(label);
    const customLabelLineProps = svgPropertiesNoEventsFromUnknown(labelLine);
    const offsetRadius = (typeof label === 'object' && 'offsetRadius' in label && typeof label.offsetRadius === 'number' && label.offsetRadius) || 20;

    return sectors.map((entry, i) => {
      const midAngle = (entry.startAngle + entry.endAngle) / 2;
      const endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
      const labelProps = {
        ...pieProps,
        ...entry,
        stroke: 'none',
        ...customLabelProps,
        index: i,
        textAnchor: getTextAnchor(endPoint.x, entry.cx),
        ...endPoint,
      } as PieLabelRenderProps;
      const lineProps = {
        ...pieProps,
        ...entry,
        fill: 'none',
        stroke: entry.fill,
        ...customLabelLineProps,
        index: i,
        points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint],
        key: 'line',
      } as CurveProps & { key: string };
      return { key: `label-${entry.startAngle}-${entry.endAngle}-${entry.midAngle}-${i}`, labelProps, lineProps, value: getValueByDataKey(entry as unknown, props.dataKey) };
    });
  });
</script>

{#snippet LabelLineItem(option: InternalProps['labelLine'], lineProps: CurveProps & { key: string })}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={lineProps} />
  {:else}
    {const otherProps = $derived(omit(lineProps, ['key']))}
    <Curve {...otherProps as Omit<CurveProps, 'children'>} type="linear" class={clsx('recharts-pie-label-line', typeof option !== 'boolean' ? (option as { className?: string } | undefined)?.className : '')} />
  {/if}
{/snippet}

{#snippet LabelItem(option: InternalProps['label'], labelProps: PieLabelRenderProps, value: unknown)}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={labelProps} />
  {:else}
    <Text {...labelProps as unknown as Omit<TextProps, 'children'>} alignmentBaseline="middle" class={clsx('recharts-pie-label-text', getClassNameFromUnknown(option))} children={value as string} />
  {/if}
{/snippet}

{#if typeof props.label === 'object' && props.label != null && 'position' in props.label}
  <LabelListFromLabelProp label={props.label as ImplicitLabelListType} />
{:else if labels}
  <Layer class="recharts-pie-labels">
    {#each labels as entry (entry.key)}
      <ZIndexLayer zIndex={DefaultZIndexes.label}>
        <Layer>
          {#if props.labelLine}
            {@render LabelLineItem(props.labelLine, entry.lineProps)}
          {/if}
          {@render LabelItem(props.label, entry.labelProps, entry.value)}
        </Layer>
      </ZIndexLayer>
    {/each}
  </Layer>
{/if}
