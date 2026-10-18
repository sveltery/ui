<svelte:options namespace="svg" />

<script lang="ts">
  import Shape from './Shape.svelte';
  import type { RadialBarSectorProps } from './RadialBarUtils.js';

  let props: RadialBarSectorProps & Record<string, unknown> = $props();
</script>

<Shape shapeType="sector" {...props} />
