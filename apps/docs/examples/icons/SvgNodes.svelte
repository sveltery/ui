<svelte:options namespace="svg" />
<script lang="ts">
  import type { IconNode } from './data.js';
  let { nodes }: { nodes: IconNode[] } = $props();
</script>
{#snippet renderNodes(items: IconNode[])}
  {#each items as node, index (index)}
    <svelte:element this={node.tag} {...node.attributes}>{@render renderNodes(node.nodes)}</svelte:element>
  {/each}
{/snippet}
{@render renderNodes(nodes)}
