<script lang="ts">
  // Supplemental source-derived acceptance probes; no Next Image or Example behavior claimed.
  import { onMount, untrack } from 'svelte';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  let hydrated = $state(false);
  let changed = $state(false);
  let shown = $state(true);
  let clicks = $state(0);
  let replaced = $state(false);
  let styleMode = $state(0);
  let ref = $state<HTMLDivElement | null>();
  let attached = $state(0);
  let cleaned = $state(0);
  function probe(node: HTMLDivElement) { untrack(() => attached++); node.dataset.probed = 'true'; return () => { untrack(() => cleaned++); }; }
  const initial = (node: HTMLDivElement) => probe(node);
  const replacement = (node: HTMLDivElement) => probe(node);
  const attach = $derived(replaced ? replacement : initial);
  const callerStyle = $derived(styleMode === 0 ? {} : styleMode === 1 ? { style: 'color: red;' } : { style: '--ratio: 3;' });
  const examples = [{ id: '16x9', ratio: 16 / 9 }, { id: '21x9', ratio: 21 / 9 }, { id: '1x1', ratio: 1 }, { id: '9x16', ratio: 9 / 16 }];
  onMount(() => { hydrated = true; });
</script>
<main data-aspect-ratio-probe data-hydrated={hydrated} class="p-8">
  <section class="grid max-w-4xl gap-4">
    {#each examples as example (example.id)}<AspectRatio data-testid={example.id} ratio={example.ratio} class="rounded-lg bg-muted" />{/each}
    <AspectRatio data-testid="custom-style" ratio={2} style="--ratio: 3;" />
    <AspectRatio data-testid="unrelated-style" ratio={2} style="color: red;" />
    <AspectRatio data-testid="undefined-style" ratio={2} style={undefined} />
    <AspectRatio data-testid="empty-style" ratio={2} style="" />
    <AspectRatio data-testid="inline-ratio" ratio={2} style="aspect-ratio: 4 / 3;" />
    <AspectRatio data-testid="class-override" ratio={2} class="static aspect-square" />
    <AspectRatio data-testid="responsive" ratio={2} class="aspect-square sm:aspect-video" />
    <AspectRatio data-testid="dynamic-style" ratio={2} {...callerStyle} />
    {#if shown}<AspectRatio id="probe-ratio" data-testid="lifecycle" data-custom={changed ? 'updated' : 'initial'} data-slot={changed ? 'consumer-ratio' : 'aspect-ratio'} ratio={changed ? 1 : 16 / 9} class={changed ? 'rounded-none' : 'rounded-lg'} bind:ref={ref} {@attach attach} onclick={() => clicks++}>{changed ? 'Updated' : 'Initial'}<span>Child</span></AspectRatio>{/if}
  </section>
  <button onclick={() => { changed = !changed; }}>Update ratio</button>
  <button onclick={() => { shown = !shown; }}>{shown ? 'Remove ratio' : 'Restore ratio'}</button>
  <button onclick={() => { replaced = !replaced; }}>Swap ratio attachments</button>
  <button onclick={() => { styleMode = (styleMode + 1) % 3; }}>Cycle caller style</button>
  <output data-testid="ratio-state">{JSON.stringify({ changed, clicks, replaced, ref: ref === undefined ? 'undefined' : ref?.tagName ?? null, attached, cleaned })}</output>
</main>
