<svelte:options namespace="svg" />

<script lang="ts" module>
  import type { SvelteProps } from '../util/svelteProps.js';
  import type { Props as UpstreamProps } from './PolarGrid.js';

  export type PolarGridProps = SvelteProps<UpstreamProps>;
</script>

<script lang="ts">
  import { omit } from 'es-toolkit';
  import { clsx } from 'clsx';
  import { polarToCartesian } from '../util/PolarUtils.js';
  import type { PolarViewBoxRequired } from '../util/types.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps } from '../util/svelteProps.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectPolarGridAngles, selectPolarGridRadii } from '../state/selectors/polarGridSelectors.js';
  import { selectPolarViewBox } from '../state/selectors/polarAxisSelectors.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { defaultPolarGridProps, getPolygonPath, type ConcentricProps, type PropsWithDefaults } from './PolarGrid.js';

  let raw: PolarGridProps = $props();
  const resolved = rechartsProps<UpstreamProps, typeof defaultPolarGridProps>(() => raw as UpstreamProps, defaultPolarGridProps);

  const polarViewBox = useAppSelector((state): PolarViewBoxRequired | undefined => selectPolarViewBox(state));
  const polarAnglesFromRedux = useAppSelector((state) => selectPolarGridAngles(state, resolved.angleAxisId));
  const polarRadiiFromRedux = useAppSelector((state) => selectPolarGridRadii(state, resolved.radiusAxisId));

  const gridProps: PropsWithDefaults | null = $derived.by(() => {
    const {
      cx: cxFromOutside,
      cy: cyFromOutside,
      innerRadius: innerRadiusFromOutside,
      outerRadius: outerRadiusFromOutside,
      polarAngles: polarAnglesInput,
      polarRadius: polarRadiusInput,
      zIndex,
      ...inputs
    } = omit(resolved, ['gridType', 'radialLines', 'angleAxisId', 'radiusAxisId']);
    const polarAngles = Array.isArray(polarAnglesInput) ? polarAnglesInput : polarAnglesFromRedux.current;
    const polarRadius = Array.isArray(polarRadiusInput) ? polarRadiusInput : polarRadiiFromRedux.current;
    if (polarAngles == null || polarRadius == null) {
      return null;
    }
    const viewBox = polarViewBox.current;
    return {
      cx: viewBox?.cx ?? cxFromOutside ?? 0,
      cy: viewBox?.cy ?? cyFromOutside ?? 0,
      innerRadius: viewBox?.innerRadius ?? innerRadiusFromOutside ?? 0,
      outerRadius: viewBox?.outerRadius ?? outerRadiusFromOutside ?? 0,
      polarAngles,
      polarRadius,
      zIndex,
      ...inputs,
    } as PropsWithDefaults;
  });

  // Upstream renders each part with `gridType radialLines {...props} polarAngles polarRadius`, in that key order.
  const partProps: PropsWithDefaults | null = $derived(
    gridProps && { gridType: resolved.gridType, radialLines: resolved.radialLines, ...gridProps, polarAngles: gridProps.polarAngles, polarRadius: gridProps.polarRadius },
  );
</script>

{#snippet PolarAngles(props: PropsWithDefaults)}
  {#if props.polarAngles && props.polarAngles.length && props.radialLines}
    {const polarAnglesProps = $derived({ stroke: '#ccc', ...svgPropertiesNoEvents(props) })}
    <g class="recharts-polar-grid-angle">
      {#each props.polarAngles as entry (entry)}
        {const start = $derived(polarToCartesian(props.cx, props.cy, props.innerRadius, entry))}
        {const end = $derived(polarToCartesian(props.cx, props.cy, props.outerRadius, entry))}
        <line {...attrs({ ...polarAnglesProps, x1: start.x, y1: start.y, x2: end.x, y2: end.y })} />
      {/each}
    </g>
  {/if}
{/snippet}

{#snippet ConcentricCircle(props: ConcentricProps)}
  <circle {...attrs({ stroke: '#ccc', fill: 'none', ...svgPropertiesNoEvents(props), className: clsx('recharts-polar-grid-concentric-circle', props.className), cx: props.cx, cy: props.cy, r: props.radius })} />
{/snippet}

{#snippet ConcentricPolygon(props: ConcentricProps)}
  <path
    {...attrs({
      stroke: '#ccc',
      fill: 'none',
      ...svgPropertiesNoEvents(props),
      className: clsx('recharts-polar-grid-concentric-polygon', props.className),
      d: getPolygonPath(props.radius, props.cx, props.cy, props.polarAngles),
    })}
  />
{/snippet}

{#snippet ConcentricGridPath(props: PropsWithDefaults)}
  {#if props.polarRadius && props.polarRadius.length}
    {const maxPolarRadius = $derived(Math.max(...props.polarRadius))}
    {const renderBackground = $derived(props.fill && props.fill !== 'none')}
    <g class="recharts-polar-grid-concentric">
      <!-- The background is its own first child, so it does not cover the strokes of smaller figures. -->
      {#if renderBackground && props.gridType === 'circle'}
        {@render ConcentricCircle({ ...props, radius: maxPolarRadius })}
      {/if}
      {#if renderBackground && props.gridType !== 'circle'}
        {@render ConcentricPolygon({ ...props, radius: maxPolarRadius })}
      {/if}
      {#each props.polarRadius as entry, i (i)}
        {#if props.gridType === 'circle'}
          {@render ConcentricCircle({ ...props, fill: 'none', radius: entry })}
        {:else}
          {@render ConcentricPolygon({ ...props, fill: 'none', radius: entry })}
        {/if}
      {/each}
    </g>
  {/if}
{/snippet}

{#if partProps && partProps.outerRadius > 0}
  <ZIndexLayer zIndex={partProps.zIndex}>
    <g class="recharts-polar-grid">
      {@render ConcentricGridPath(partProps)}
      {@render PolarAngles(partProps)}
    </g>
  </ZIndexLayer>
{/if}
