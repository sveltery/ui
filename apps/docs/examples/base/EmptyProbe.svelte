<script lang="ts">
  // Supplemental native primitive witnesses; no upstream Empty example compositions are ported.
  import { onMount, untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '@sveltery/ui/empty';
  const parts = [Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia];
  let hydrated = $state(false);
  let changed = $state(false);
  let shown = $state(true);
  let clicks = $state(0);
  let replaced = $state(false);
  let refs = $state<(HTMLDivElement | null | undefined)[]>(parts.map((_, index) => index % 2 ? null : undefined));
  let attachments = $state(0);
  let cleanups = $state(0);
  function attachment(node: HTMLDivElement) { untrack(() => attachments++); node.dataset.probed = 'empty'; return () => untrack(() => cleanups++); }
  const initial = (node: HTMLDivElement) => attachment(node);
  const replacement = (node: HTMLDivElement) => attachment(node);
  const spread = $derived({ [createAttachmentKey()]: replaced ? replacement : initial });
  const tags = $derived(refs.map(ref => ref === undefined ? 'undefined' : ref?.tagName ?? null));
  onMount(() => { hydrated = true; });
</script>
<main data-empty-probe data-hydrated={hydrated} class="p-8">
  <h1>Supplemental Empty primitive probe</h1>
  <section data-testid="hosts" class="flex flex-col gap-4">
    {#if shown}
      {#each parts as Part, index (Part)}
        <Part id={`probe-empty-${index}`} data-empty-host="" data-slot={changed ? `override-${index}` : undefined} data-custom={changed ? 'updated' : 'initial'} title={changed ? 'Updated & <Empty>' : 'Initial & <Empty>'} class={changed ? ['gap-4', { 'text-lg': true }] : undefined} style={changed ? 'color: rgb(60, 70, 80)' : 'color: rgb(30, 40, 50)'} {...index === 5 ? { variant: changed ? 'icon' as const : 'default' as const } : {}} bind:ref={refs[index]} {...spread} onclick={() => clicks++}>{changed ? 'Updated' : 'Initial'} {index}{#if index === 3}<a href="#probe-target" data-testid="direct-link">Direct link</a><span><a href="#probe-target" data-testid="nested-link">Nested link</a></span>{/if}{#if index === 5}<svg aria-hidden="true" viewBox="0 0 16 16" data-testid="reactive-svg"><path d="M1 1h14v14H1z" /></svg>{/if}</Part>
      {/each}
    {/if}
  </section>
  <section data-testid="media-selectors" class="flex items-start gap-4">
    <EmptyMedia data-testid="media-default"><svg aria-hidden="true" viewBox="0 0 16 16" width="24" height="24"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
    <EmptyMedia variant="icon" data-testid="media-icon"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
    <EmptyMedia variant="icon" data-testid="media-sized"><svg class="size-6" aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
    <EmptyMedia variant="icon" data-testid="media-size-substring"><svg class="custom-size-witness" width="28" height="28" aria-hidden="true" viewBox="0 0 16 16"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
    <EmptyMedia variant={null} data-testid="media-null"><svg aria-hidden="true" viewBox="0 0 16 16" width="24" height="24"><path d="M1 1h14v14H1z" /></svg></EmptyMedia>
  </section>
  <button type="button" onclick={() => changed = !changed}>Update Empty</button>
  <button type="button" onclick={() => replaced = !replaced}>Swap attachments</button>
  <button type="button" onclick={() => shown = !shown}>{shown ? 'Remove Empty' : 'Restore Empty'}</button>
  <output data-testid="probe-state">{JSON.stringify({ changed, clicks, tags, attachments, cleanups })}</output>
  <span id="probe-target">Link target</span>
</main>
