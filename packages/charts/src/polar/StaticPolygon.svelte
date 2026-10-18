<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { MouseEvent } from '../react.js';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import type { DotsDotProps } from '../component/Dots.js';
  import Layer from '../container/Layer.svelte';
  import Polygon from '../shape/Polygon.svelte';
  import Dots from '../component/Dots.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import type { InternalRadarProps, RadarPoint } from './Radar.js';

  let { points, baseLinePoints, props }: { points: ReadonlyArray<RadarPoint>; baseLinePoints: ReadonlyArray<RadarPoint>; props: InternalRadarProps } = $props();

  const handleMouseEnter = (e: MouseEvent<SVGPolygonElement>) => {
    const { onMouseEnter } = props;
    if (onMouseEnter) {
      onMouseEnter(props, e);
    }
  };

  const handleMouseLeave = (e: MouseEvent<SVGPolygonElement>) => {
    const { onMouseLeave } = props;
    if (onMouseLeave) {
      onMouseLeave(props, e);
    }
  };

  const dotsBaseProps = $derived(svgPropertiesNoEvents(omit(props, ['id'])) as DotsDotProps);
</script>

{#if points != null}
  <Layer class="recharts-radar-polygon">
    {#if typeof props.shape === 'function'}
      <RenderProp of={props.shape as never} props={{ ...props, points }} />
    {:else}
      <Polygon
        {...svgPropertiesAndEvents(props)}
        {...{ onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }}
        points={points as RadarPoint[]}
        baseLinePoints={props.isRange ? (baseLinePoints as RadarPoint[]) : undefined}
        connectNulls={props.connectNulls}
      />
    {/if}
    <Dots {points} dot={props.dot} className="recharts-radar-dots" dotClassName="recharts-radar-dot" dataKey={props.dataKey} baseProps={dotsBaseProps} />
  </Layer>
{/if}
