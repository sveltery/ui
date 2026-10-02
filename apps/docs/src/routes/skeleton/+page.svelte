<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import SkeletonExample from '../../../examples/base/SkeletonExample.svelte';
  let hydrated = $state(false);
  let visible = $state(true);
  let label = $state('Initial');
  let ref = $state<HTMLDivElement | null | undefined>();
  let attached = 0;
  let detached = 0;
  let lifecycle = $state('');
  function observe(node: HTMLDivElement) { attached++; node.dataset.attached = 'true'; return () => { detached++; }; }
  onMount(() => { hydrated = true; });
</script>
<main class="p-8" data-hydrated={hydrated}>
  <SkeletonExample />
  {#if visible}
    {const description = $derived(`${label} placeholder`)}
    <Skeleton id="lifecycle-skeleton" title={description} class="h-4 w-40" bind:ref {@attach observe}>{label}</Skeleton>
  {/if}
  <button onclick={() => { label = 'Updated'; }}>Update placeholder</button>
  <button onclick={() => { visible = !visible; }}>Toggle placeholder</button>
  <button onclick={() => { lifecycle = JSON.stringify({ attached, detached, ref: ref?.id ?? null }); }}>Inspect Skeleton lifecycle</button>
  <output data-testid="skeleton-lifecycle">{lifecycle}</output>
</main>
