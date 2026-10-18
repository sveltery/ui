<script lang="ts">
  import type { ReactNode } from '../react.js';
  import RenderProp from './RenderProp.svelte';
  import RenderNode from './RenderNode.svelte';

  /** A ReactNode value the way react-dom renders it: text for strings and numbers, nothing for booleans and nullish, each item of an array. */
  let { value }: { value: ReactNode } = $props();
</script>

{#if typeof value === 'function'}<RenderProp of={value as never} props={{}} />{:else if typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint'}{value}{:else if value != null && typeof value === 'object' && Symbol.iterator in value}{#each [...value] as item, index (index)}<RenderNode value={item} />{/each}{/if}
