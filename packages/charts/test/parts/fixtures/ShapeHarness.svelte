<script lang="ts">
  import type { Component } from 'svelte';
  import Surface from '../../../src/container/Surface.svelte';

  let { shapes }: { shapes: Array<{ component: Component<Record<string, unknown>>; props: Record<string, unknown> }> } = $props();
</script>

<Surface width={500} height={500}
  >{#each shapes as { component: Shape, props }, index (index)}<Shape {...props} />{/each}</Surface
>
