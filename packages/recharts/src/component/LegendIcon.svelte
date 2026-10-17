<svelte:options namespace="svg" />

<script lang="ts">
  import { omit } from 'es-toolkit';
  import type { LegendType } from '../util/types.js';
  import Symbols from '../shape/Symbols.svelte';
  import RenderProp from '../util/RenderProp.svelte';
  import { getStrokeDasharray, SIZE, type LegendPayload } from './DefaultLegendContent.js';

  // Upstream's Icon, local to DefaultLegendContent. It draws svg, so it lives in its own svg component.
  let { data, iconType, inactiveColor }: { data: LegendPayload; iconType: LegendType | undefined; inactiveColor: string } = $props();

  const halfSize = SIZE / 2;
  const sixthSize = SIZE / 6;
  const thirdSize = SIZE / 3;
  const color = $derived(data.inactive ? inactiveColor : data.color);
  const preferredIcon = $derived(iconType ?? data.type);
</script>

{#if preferredIcon === 'none'}{:else if preferredIcon === 'plainline'}
  <line
    stroke-width={4}
    fill="none"
    stroke={color}
    stroke-dasharray={getStrokeDasharray(data.payload)}
    x1={0}
    y1={halfSize}
    x2={SIZE}
    y2={halfSize}
    class="recharts-legend-icon"
  />
{:else if preferredIcon === 'line'}
  <path
    stroke-width={4}
    fill="none"
    stroke={color}
    d={`M0,${halfSize}h${thirdSize}
            A${sixthSize},${sixthSize},0,1,1,${2 * thirdSize},${halfSize}
            H${SIZE}M${2 * thirdSize},${halfSize}
            A${sixthSize},${sixthSize},0,1,1,${thirdSize},${halfSize}`}
    class="recharts-legend-icon"
  />
{:else if preferredIcon === 'rect'}
  <path stroke="none" fill={color} d={`M0,${SIZE / 8}h${SIZE}v${(SIZE * 3) / 4}h${-SIZE}z`} class="recharts-legend-icon" />
{:else if typeof data.legendIcon === 'function'}
  <RenderProp of={data.legendIcon as never} props={omit(data, ['legendIcon'])} />
{:else}
  <Symbols fill={color} cx={halfSize} cy={halfSize} size={SIZE} sizeType="diameter" type={preferredIcon} />
{/if}
