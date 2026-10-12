<script lang="ts">
  import type { Component } from 'svelte';
  let { component: Part, ...props }: { component: Component<Record<string, unknown>> } & Record<string, unknown> = $props();
</script>
<Part {...props}>
  {#snippet render(hostProps: Record<string, unknown>, state: Record<string, unknown>, children?: import('svelte').Snippet)}
    <a href="/docs" data-state-slot={state.slot} {...hostProps}>{@render children?.()}</a>
  {/snippet}
  Link text
</Part>
