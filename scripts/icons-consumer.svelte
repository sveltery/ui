<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { createAttachmentKey } from 'svelte/attachments';
  import { IconPlaceholder, IconLibraryProvider, iconLibraries, type IconLibraryName } from '@sveltery/ui/icons';
  let library = $state<IconLibraryName>('lucide');
  const original = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
  let names = $state({ ...original });
  let hydrated = $state(false);
  let show = $state(true);
  let ref = $state<SVGSVGElement | null>();
  let clicks = $state(0);
  let lifecycle = $state({ attached: 0, detached: 0 });
  const key = createAttachmentKey();
  const attach = (node: SVGSVGElement) => {
    untrack(() => { lifecycle = { ...lifecycle, attached: lifecycle.attached + 1 }; });
    node.dataset.attached = 'first';
    return () => { untrack(() => { lifecycle = { ...lifecycle, detached: lifecycle.detached + 1 }; }); };
  };
  const second = (node: SVGSVGElement) => {
    untrack(() => { lifecycle = { ...lifecycle, attached: lifecycle.attached + 1 }; });
    node.dataset.attached = 'second';
    return () => { untrack(() => { lifecycle = { ...lifecycle, detached: lifecycle.detached + 1 }; }); };
  };
  let attachment = $state(attach);
  onMount(() => { hydrated = true; });
  function setNames(name: string) { names = Object.fromEntries(iconLibraries.map(library => [library, name])) as typeof names; }
</script>
<main data-icons-consumer data-hydrated={hydrated} data-library={library} data-attached={lifecycle.attached} data-detached={lifecycle.detached} data-ref={ref?.localName ?? 'none'} data-clicks={clicks}>
  <IconLibraryProvider {library}>
    {#if show}
      <IconPlaceholder {...names} bind:ref data-testid="consumer-icon" strokeWidth={7} aria-label="Previous" role="img" onclick={() => clicks++} {...{ [key]: attachment }}>
        <text data-icon-child>Native &amp; escaped</text>
      </IconPlaceholder>
    {/if}
  </IconLibraryProvider>
  {#each iconLibraries as next (next)}<button onclick={() => { library = next; }}>Select {next}</button>{/each}
  <button onclick={() => setNames('UnknownExport')}>Unknown</button>
  <button onclick={() => setNames('')}>Absent</button>
  <button onclick={() => { names = { ...original }; }}>Restore</button>
  <button onclick={() => { names.lucide = 'ArrowRightIcon'; }}>Change name</button>
  <button onclick={() => { attachment = second; }}>Swap attachment</button>
  <button onclick={() => { show = false; }}>Remove</button>
</main>
