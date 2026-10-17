<script lang="ts">
  import { isLabelContentAFunction } from './Label.js';
  import type { ImplicitLabelListType, LabelListProps } from './LabelList.hooks.svelte.js';
  import LabelList from './LabelList.svelte';

  let { label }: { label?: ImplicitLabelListType } = $props();
</script>

{#if label === true}
  <LabelList />
{:else if isLabelContentAFunction(label)}
  <LabelList content={label as LabelListProps["content"]} />
{:else if label && typeof label === 'object'}
  <LabelList {...label} type={String((label as { type?: unknown }).type)} />
{/if}
