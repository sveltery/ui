<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Card, CardHeader, CardContent } from '@sveltery/ui/card';
  let hydrated = $state(false);
  let ref = $state<HTMLDivElement>();
  let shown = $state(true);
  let changed = $state(false);
  let attached = $state(0);
  let cleaned = $state(0);
  const caption = $derived(changed ? 'Updated' : 'Initial');
  function probe(node: HTMLDivElement) {
    untrack(() => attached++);
    node.dataset.attached = 'true';
    return () => { untrack(() => cleaned++); };
  }
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated} class="p-8">
  <!-- The actual pinned SkeletonCard composition; test attributes are consumer probes. -->
  <Card class="w-full" data-testid="skeleton-card">
    <CardHeader>
      <Skeleton class="h-4 w-2/3" />
      <Skeleton class="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton class="aspect-square w-full" />
    </CardContent>
  </Card>
  {#if shown}<Skeleton data-testid="skeleton" class={changed ? 'h-8 w-64 rounded-none animate-none' : 'h-4 w-32'} bind:ref={ref} {@attach probe}>{caption}</Skeleton>{/if}
  <button onclick={() => { changed = true; }}>Update skeleton</button>
  <button onclick={() => { shown = false; }}>Remove skeleton</button>
  <output data-testid="skeleton-state">{JSON.stringify({ ref: ref?.tagName ?? null, attached, cleaned })}</output>
</main>
