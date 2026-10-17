<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PolarViewBoxRequired } from '../util/types.js';
  import { setPolarLabelContext } from './Label.hooks.svelte.js';

  let { cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise, children }: PolarViewBoxRequired & { children?: Snippet } = $props();
  const viewBox: PolarViewBoxRequired = $derived({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise });
  setPolarLabelContext({
    get current() {
      return viewBox;
    },
  });
</script>

{@render children?.()}
