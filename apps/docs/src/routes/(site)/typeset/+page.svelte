<!-- Port of shadcn's apps/v4/app/(app)/(typeset)/typeset/page.tsx, layout.tsx and components/docs-panel.tsx at d2fba50. -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { replaceState } from '$app/navigation';
  import { buttonVariants } from '$registry/bases/base/ui/button';
  import { cn } from 'cn';
  import { Skeleton } from '$registry/bases/base/ui/skeleton';
  import { site } from '$lib/site';
  import { setBuilder, TypesetBuilder } from '$lib/typeset/builder.svelte';
  import Customizer from '$lib/typeset/Customizer.svelte';
  import Docs from '$lib/typeset/Docs.svelte';
  import { shortcutCommand } from '$lib/typeset/messages';
  import Preview from '$lib/typeset/Preview.svelte';
  import { mode } from '$lib/theme.svelte';

  const builder = setBuilder(new TypesetBuilder());
  // The page is prerendered without a query, so the parameters are read in the browser before anything shows.
  let ready = $state(false);

  onMount(() => {
    builder.load(new URLSearchParams(location.search));
    ready = true;
  });
  onDestroy(() => builder.destroy());

  // The URL follows the parameters, so a copied link reopens the same typeset. It replaces the entry, as upstream.
  $effect(() => {
    const search = builder.search;
    if (ready && location.search !== search) replaceState(`${location.pathname}${search}`, {});
  });

  function keydown(event: KeyboardEvent) {
    const command = shortcutCommand(event);
    if (!command) return;
    event.preventDefault();
    if (command === 'shuffle') builder.shuffle();
    else if (command === 'reset') builder.reset();
    else if (command === 'undo') builder.undo();
    else if (command === 'redo') builder.redo();
    else mode.toggle();
  }
</script>

<svelte:document onkeydown={keydown} />

<svelte:head>
  <title>Typeset - {site.name}</title>
  <meta name="description" content="Typography for markdown you don't control." />
</svelte:head>

<div class="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden section-soft [--customizer-width:--spacing(48)] [--gap:--spacing(4)] md:[--gap:--spacing(6)] 2xl:[--customizer-width:--spacing(56)]">
  <div data-slot="designer" class="flex min-h-0 flex-1 flex-col items-start gap-(--gap) p-(--gap) pt-[calc(var(--gap)*0.25)] md:flex-row-reverse">
    {#if ready}
      <div class="hidden w-88 flex-col items-start gap-3 xl:flex 2xl:w-104">
        <div class="isolate flex max-h-[calc(100vh-16rem)] w-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
          <Docs />
        </div>
        <a href="/docs/typeset" class={cn(buttonVariants({ variant: 'link', size: 'sm' }), 'text-muted-foreground')}>Read the docs</a>
      </div>
      <Preview />
      <Customizer />
    {:else}
      <Skeleton class="isolate hidden w-80 shrink-0 self-stretch rounded-2xl xl:block 2xl:w-96" />
      <Skeleton class="min-h-0 w-full flex-1 self-stretch rounded-2xl" />
      <Skeleton class="min-h-[151px] w-full self-start rounded-2xl md:h-full md:max-h-full md:min-h-0 md:w-(--customizer-width)" />
    {/if}
  </div>
</div>
