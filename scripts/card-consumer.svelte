<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@sveltery/ui/card';
  let hydrated = $state(false);
  let shown = $state(true);
  let changed = $state(false);
  let refs = $state<(HTMLDivElement | null | undefined)[]>([undefined, null, undefined, null, undefined, null, undefined]);
  let attached = $state(0);
  let cleaned = $state(0);
  let clicks = $state<string[]>([]);
  const attachment = { [createAttachmentKey()]: (node: HTMLDivElement) => { node.dataset.attached = 'true'; untrack(() => attached++); return () => { untrack(() => cleaned++); }; } };
  onMount(() => { hydrated = true; });
</script>
{const label = $derived(changed ? 'Updated & <Card>' : 'Initial & <Card>')}
<main data-hydrated={hydrated} class="p-8">
  <button onclick={() => { clicks = []; }}>Before card</button>
  {#if shown}
    <Card id="consumer-card" bind:ref={refs[0]} {...attachment} size={changed ? 'sm' : 'default'} class={changed ? 'w-full max-w-sm rounded-none' : 'w-full max-w-sm'} title={label} onclick={() => clicks.push('card')}>
      <CardHeader id="consumer-card-header" bind:ref={refs[1]} {...attachment}>
        <CardTitle id="consumer-card-title" bind:ref={refs[2]} {...attachment}>{label} title</CardTitle>
        <CardDescription id="consumer-card-description" bind:ref={refs[3]} {...attachment}>{label} description</CardDescription>
        <CardAction id="consumer-card-action" bind:ref={refs[4]} {...attachment} onclick={() => clicks.push('action')}>{label} action</CardAction>
      </CardHeader>
      <CardContent id="consumer-card-content" bind:ref={refs[5]} {...attachment} class={changed ? 'px-6' : undefined}>{label} content</CardContent>
      <CardFooter id="consumer-card-footer" bind:ref={refs[6]} {...attachment}>{label} footer</CardFooter>
    </Card>
  {/if}
  <button>After card</button>
  <button onclick={() => { changed = true; }}>Update card</button>
  <button onclick={() => { shown = !shown; }}>Toggle card</button>
  <output data-testid="card-state">{JSON.stringify({ refs: refs.map(ref => ref?.id ?? null), attached, cleaned })}</output>
  <output data-testid="card-clicks">{JSON.stringify(clicks)}</output>
</main>
