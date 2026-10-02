<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../../../registry/bases/base/ui/card/index.js';
  import CardExample from '../../../examples/base/CardExample.svelte';
  let hydrated = $state(false);
  let visible = $state(true);
  let label = $state('Initial');
  let size = $state<'default' | 'sm'>('default');
  let className = $state('px-3');
  let cardRef = $state<HTMLDivElement>();
  let headerRef = $state<HTMLDivElement>();
  let titleRef = $state<HTMLDivElement>();
  let descriptionRef = $state<HTMLDivElement>();
  let actionRef = $state<HTMLDivElement>();
  let contentRef = $state<HTMLDivElement>();
  let footerRef = $state<HTMLDivElement>();
  let attached = $state(0);
  let detached = $state(0);
  const attachment = { [createAttachmentKey()]: (node: HTMLDivElement) => { node.dataset.attached = 'true'; untrack(() => { attached++; }); return () => { untrack(() => { detached++; }); }; } };
  onMount(() => { hydrated = true; });
</script>
{const caption = $derived(`${label} card part`)}
<main class="p-8" data-hydrated={hydrated}>
  <CardExample />
  <section data-lifecycle>
    {#if visible}
      <Card id="lifecycle-card" {size} class={className} title={caption} bind:ref={cardRef} {...attachment}>
        <CardHeader id="lifecycle-card-header" class={className} title={caption} bind:ref={headerRef} {...attachment}>
          <CardTitle id="lifecycle-card-title" class={className} title={caption} bind:ref={titleRef} {...attachment}>{label} title</CardTitle>
          <CardDescription id="lifecycle-card-description" class={className} title={caption} bind:ref={descriptionRef} {...attachment}>{label} description</CardDescription>
          <CardAction id="lifecycle-card-action" class={className} title={caption} bind:ref={actionRef} {...attachment}>{label} action</CardAction>
        </CardHeader>
        <CardContent id="lifecycle-card-content" class={className} title={caption} bind:ref={contentRef} {...attachment}>{label} content</CardContent>
        <CardFooter id="lifecycle-card-footer" class={className} title={caption} bind:ref={footerRef} {...attachment}>{label} footer</CardFooter>
      </Card>
    {/if}
  </section>
  <button onclick={() => { label = 'Updated'; size = 'sm'; className = 'px-6'; }}>Update card parts</button>
  <button onclick={() => { visible = !visible; }}>Toggle card parts</button>
  <output data-testid="card-state">{JSON.stringify({ refs: [cardRef, headerRef, titleRef, descriptionRef, actionRef, contentRef, footerRef].map(ref => ref?.id ?? null), attached, detached })}</output>
</main>
