<svelte:options namespace="svg" />

<script lang="ts">
  import Shape from './Shape.svelte';
  import type { BarRectangleProps } from './BarUtils.js';

  let props: BarRectangleProps & Record<string, unknown> = $props();
</script>

<Shape shapeType="rectangle" activeClassName="recharts-active-bar" inActiveClassName="recharts-inactive-bar" {...props} />
