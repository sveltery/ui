<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import type { SvelteArgs } from '../util/svelteProps.js';
  import type { CursorProps as UpstreamCursorProps } from './Cursor.js';

  /** The Tooltip's cursor: true, false, extra svg props for the default cursor, or a snippet that receives the cursor's props. */
  export type CursorDefinition = boolean | Record<string, unknown> | Snippet<[SvelteArgs<Record<string, unknown>>]>;
  export type CursorProps = Omit<UpstreamCursorProps, 'cursor'> & { cursor: CursorDefinition };
</script>

<script lang="ts">
  import { clsx } from 'clsx';
  import { isPolarCoordinate } from '../util/types.js';
  import { getCursorRectangle } from '../util/cursor/getCursorRectangle.js';
  import { getCursorPoints } from '../util/cursor/getCursorPoints.js';
  import { useChartLayout, useOffsetInternal } from '../context/chartLayoutContext.svelte.js';
  import { useTooltipAxisBandSize } from '../context/useTooltipAxis.js';
  import { useChartName } from '../state/selectors/selectors.hooks.js';
  import { svgPropertiesNoEventsFromUnknown } from '../util/svgPropertiesNoEvents.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import Rectangle from '../shape/Rectangle.svelte';
  import Curve from '../shape/Curve.svelte';
  import RenderProp from '../util/RenderProp.svelte';

  let props: CursorProps = $props();

  const tooltipAxisBandSize = useTooltipAxisBandSize();
  const offset = useOffsetInternal();
  const layout = useChartLayout();
  const chartName = useChartName();

  type Rendered = { cursorComp: 'rectangle' | 'curve' | null; cursorProps: Record<string, unknown>; preferredZIndex: number };

  // Upstream's CursorInternal, which Cursor renders once the band size, offset, layout and chart name are known.
  const rendered = $derived.by((): Rendered | null => {
    if (tooltipAxisBandSize.current == null || layout.current == null || chartName.current == null) {
      return null;
    }
    const { coordinate, payload, index, cursor, tooltipEventType } = props;
    const activeCoordinate = coordinate;
    const activePayload = payload;
    const activeTooltipIndex = index;
    if (!cursor || !activeCoordinate || (chartName.current !== 'ScatterChart' && tooltipEventType !== 'axis')) {
      return null;
    }
    let restProps: object, cursorComp: Rendered['cursorComp'], preferredZIndex: number;

    if (chartName.current === 'ScatterChart') {
      // Cross arrives with ScatterChart.
      restProps = activeCoordinate;
      cursorComp = null;
      preferredZIndex = DefaultZIndexes.cursorLine;
    } else if (chartName.current === 'BarChart') {
      restProps = getCursorRectangle(layout.current, activeCoordinate, offset.current, tooltipAxisBandSize.current);
      cursorComp = 'rectangle';
      preferredZIndex = DefaultZIndexes.cursorRectangle;
    } else if (layout.current === 'radial' && isPolarCoordinate(activeCoordinate)) {
      // Sector arrives with the polar charts.
      restProps = {};
      cursorComp = null;
      preferredZIndex = DefaultZIndexes.cursorLine;
    } else {
      restProps = { points: getCursorPoints(layout.current, activeCoordinate, offset.current) };
      cursorComp = 'curve';
      preferredZIndex = DefaultZIndexes.cursorLine;
    }

    const extraClassName: string | undefined = typeof cursor === 'object' && 'className' in cursor ? (cursor.className as string | undefined) : undefined;

    const cursorProps = {
      stroke: '#ccc',
      pointerEvents: 'none',
      ...offset.current,
      ...restProps,
      ...svgPropertiesNoEventsFromUnknown(cursor),
      payload: activePayload,
      payloadIndex: activeTooltipIndex,
      className: clsx('recharts-tooltip-cursor', extraClassName),
    };
    return { cursorComp, cursorProps, preferredZIndex };
  });
</script>

{#if rendered}
  <ZIndexLayer zIndex={props.zIndex ?? rendered.preferredZIndex}>
    {#if typeof props.cursor === 'function'}
      <RenderProp of={props.cursor} props={rendered.cursorProps} />
    {:else if rendered.cursorComp === 'rectangle'}
      <Rectangle {...rendered.cursorProps} />
    {:else if rendered.cursorComp === 'curve'}
      <Curve {...rendered.cursorProps} />
    {/if}
  </ZIndexLayer>
{/if}
