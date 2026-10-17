<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps, WithSnippets } from '../util/svelteProps.js';
  import type { GridLineTypeFunctionProps, Props as UpstreamProps } from './CartesianGrid.js';

  export type CartesianGridProps = SvelteProps<WithSnippets<UpstreamProps, { horizontal: GridLineTypeFunctionProps; vertical: GridLineTypeFunctionProps }>>;
</script>

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { isNumber } from '../util/DataUtils.js';
  import { isPositiveNumber } from '../util/isWellBehavedNumber.js';
  import { warn } from '../util/LogUtils.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectAxisPropsNeededForCartesianGridTicksGenerator } from '../state/selectors/axisSelectors.js';
  import { useChartHeight, useChartWidth, useOffsetInternal } from '../context/chartLayoutContext.svelte.js';
  import { useIsPanorama } from '../context/PanoramaContext.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { defaultCartesianGridProps, defaultHorizontalCoordinatesGenerator, defaultVerticalCoordinatesGenerator } from './CartesianGrid.js';

  let raw: CartesianGridProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultCartesianGridProps>(() => raw as UpstreamProps, defaultCartesianGridProps);

  const chartWidth = useChartWidth();
  const chartHeight = useChartHeight();
  const offset = useOffsetInternal();
  const isPanorama = useIsPanorama();

  const propsIncludingDefaults = $derived({
    ...resolved,
    x: isNumber(resolved.x) ? resolved.x : offset.current.left,
    y: isNumber(resolved.y) ? resolved.y : offset.current.top,
    width: isNumber(resolved.width) ? resolved.width : offset.current.width,
    height: isNumber(resolved.height) ? resolved.height : offset.current.height,
  });

  const xAxis = useAppSelector((state) => selectAxisPropsNeededForCartesianGridTicksGenerator(state, 'xAxis', resolved.xAxisId, isPanorama));
  const yAxis = useAppSelector((state) => selectAxisPropsNeededForCartesianGridTicksGenerator(state, 'yAxis', resolved.yAxisId, isPanorama));

  const points = $derived.by(() => {
    const { x, y, width, height, syncWithTicks, horizontalValues, verticalValues } = propsIncludingDefaults;
    if (!isPositiveNumber(width) || !isPositiveNumber(height) || !isNumber(x) || !isNumber(y)) {
      return null;
    }
    // The generators come from props only; their defaults are applied here.
    const verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
    const horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
    let { horizontalPoints, verticalPoints } = propsIncludingDefaults;

    if ((!horizontalPoints || !horizontalPoints.length) && typeof horizontalCoordinatesGenerator === 'function') {
      const isHorizontalValues = horizontalValues && horizontalValues.length;
      const generatorResult = horizontalCoordinatesGenerator(
        {
          yAxis: yAxis.current ? { ...yAxis.current, ticks: isHorizontalValues ? horizontalValues : yAxis.current.ticks } : undefined,
          width: chartWidth.current ?? width,
          height: chartHeight.current ?? height,
          offset: offset.current,
        },
        isHorizontalValues ? true : syncWithTicks,
      );
      warn(Array.isArray(generatorResult), `horizontalCoordinatesGenerator should return Array but instead it returned [${typeof generatorResult}]`);
      if (Array.isArray(generatorResult)) {
        horizontalPoints = generatorResult;
      }
    }

    if ((!verticalPoints || !verticalPoints.length) && typeof verticalCoordinatesGenerator === 'function') {
      const isVerticalValues = verticalValues && verticalValues.length;
      const generatorResult = verticalCoordinatesGenerator(
        {
          xAxis: xAxis.current ? { ...xAxis.current, ticks: isVerticalValues ? verticalValues : xAxis.current.ticks } : undefined,
          width: chartWidth.current ?? width,
          height: chartHeight.current ?? height,
          offset: offset.current,
        },
        isVerticalValues ? true : syncWithTicks,
      );
      warn(Array.isArray(generatorResult), `verticalCoordinatesGenerator should return Array but instead it returned [${typeof generatorResult}]`);
      if (Array.isArray(generatorResult)) {
        verticalPoints = generatorResult;
      }
    }
    return { horizontalPoints, verticalPoints };
  });

  type Stripe = { x: number; y: number; width: number; height: number; fill: string | undefined };

  function stripes(sortedPoints: number[], start: number, size: number, fills: string[], horizontal: boolean): Array<Stripe | null> {
    const { x, y, width, height } = propsIncludingDefaults;
    return sortedPoints.map((entry, i) => {
      // Upstream strips only the last stripe when it is invisible, not every invisible one.
      const nextPoint = sortedPoints[i + 1];
      const length = nextPoint == null ? start + size - entry : nextPoint - entry;
      if (length <= 0) {
        return null;
      }
      const fill = fills[i % fills.length];
      return horizontal ? { y: entry, x, height: length, width, fill } : { x: entry, y, width: length, height, fill };
    });
  }

  const horizontalStripes = $derived.by(() => {
    const { horizontalFill, y, height, horizontal = true } = propsIncludingDefaults;
    const horizontalPoints = points?.horizontalPoints;
    if (!horizontal || !horizontalFill || !horizontalFill.length || horizontalPoints == null) {
      return null;
    }
    const sorted = horizontalPoints.map((e) => Math.round(e + y - y)).sort((a, b) => a - b);
    // Upstream compares with !== here, not <=.
    if (y !== sorted[0]) {
      sorted.unshift(0);
    }
    return stripes(sorted, y, height, horizontalFill, true);
  });

  const verticalStripes = $derived.by(() => {
    const { vertical = true, verticalFill, x, width } = propsIncludingDefaults;
    const verticalPoints = points?.verticalPoints;
    if (!vertical || !verticalFill || !verticalFill.length || verticalPoints == null) {
      return null;
    }
    const sorted = verticalPoints.map((e) => Math.round(e + x - x)).sort((a, b) => a - b);
    if (x !== sorted[0]) {
      sorted.unshift(0);
    }
    return stripes(sorted, x, width, verticalFill, false);
  });

  function gridLines(option: unknown, linePoints: number[] | undefined, horizontal: boolean) {
    if (!option || !linePoints || !linePoints.length) {
      return null;
    }
    const otherLineItemProps = omit(propsIncludingDefaults, ['xAxisId', 'yAxisId']);
    const { x, y, width, height } = propsIncludingDefaults;
    return linePoints.map((entry, i) => {
      const coordinates = horizontal ? { x1: x, y1: entry, x2: x + width, y2: entry } : { x1: entry, y1: y, x2: entry, y2: y + height };
      return { ...otherLineItemProps, offset: offset.current, xAxis: xAxis.current, yAxis: yAxis.current, ...coordinates, key: `line-${i}`, index: i };
    });
  }

  const horizontalLines = $derived(gridLines(propsIncludingDefaults.horizontal ?? true, points?.horizontalPoints, true));
  const verticalLines = $derived(gridLines(propsIncludingDefaults.vertical ?? true, points?.verticalPoints, false));

  function lineAttributes(lineItemProps: Record<string, unknown>) {
    const { x1, y1, x2, y2, ...others } = omit(lineItemProps, ['key']);
    const restOfFilteredProps = omit((svgPropertiesNoEvents(others) ?? {}) as Record<string, unknown>, ['offset']);
    return attrs({ ...restOfFilteredProps, x1, y1, x2, y2, fill: 'none' });
  }
</script>

{#snippet LineItem(option: unknown, lineItemProps: Record<string, unknown>)}
  {#if typeof option === 'function'}
    <RenderProp of={option as never} props={lineItemProps} />
  {:else}
    <line {...lineAttributes(lineItemProps)} />
  {/if}
{/snippet}

{#snippet Stripes(items: Array<Stripe | null>, className: string)}
  <g class={className}>
    {#each items as stripe, i (i)}
      {#if stripe}
        <rect {...attrs({ ...stripe, stroke: 'none', fillOpacity: propsIncludingDefaults.fillOpacity, className: 'recharts-cartesian-grid-bg' })} />
      {/if}
    {/each}
  </g>
{/snippet}

{#if points}
  <ZIndexLayer zIndex={propsIncludingDefaults.zIndex}>
    <g class="recharts-cartesian-grid">
      {#if propsIncludingDefaults.fill && propsIncludingDefaults.fill !== 'none'}
        {const { fill, fillOpacity, x, y, width, height, ry } = $derived(propsIncludingDefaults)}
        <rect {...attrs({ x, y, ry, width, height, stroke: 'none', fill, fillOpacity, className: 'recharts-cartesian-grid-bg' })} />
      {/if}
      {#if horizontalStripes}
        {@render Stripes(horizontalStripes, 'recharts-cartesian-gridstripes-horizontal')}
      {/if}
      {#if verticalStripes}
        {@render Stripes(verticalStripes, 'recharts-cartesian-gridstripes-vertical')}
      {/if}
      {#if horizontalLines}
        <g class="recharts-cartesian-grid-horizontal">
          {#each horizontalLines as lineItemProps, i (i)}
            {@render LineItem(propsIncludingDefaults.horizontal ?? true, lineItemProps)}
          {/each}
        </g>
      {/if}
      {#if verticalLines}
        <g class="recharts-cartesian-grid-vertical">
          {#each verticalLines as lineItemProps, i (i)}
            {@render LineItem(propsIncludingDefaults.vertical ?? true, lineItemProps)}
          {/each}
        </g>
      {/if}
    </g>
  </ZIndexLayer>
{/if}
