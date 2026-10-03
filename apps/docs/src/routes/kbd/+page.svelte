<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { page } from '$app/state';
  import { IconLibraryProvider, iconLibraries, type IconLibraryName } from '@sveltery/ui/icons';
  import { createAttachmentKey } from 'svelte/attachments';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import KbdExample from '../../../examples/base/KbdExample.svelte';
  const library = $derived(iconLibraries.includes(page.url.searchParams.get('library') as IconLibraryName) ? page.url.searchParams.get('library') as IconLibraryName : 'lucide');
  let hydrated = $state(false);
  let visible = $state(true);
  let label = $state('Ctrl');
  let className = $state('px-3');
  let ref = $state<HTMLElement>();
  let groupRef = $state<HTMLElement>();
  let attached = $state(0);
  let detached = $state(0);
  const attachment = { [createAttachmentKey()]: () => { untrack(() => { attached++; }); return () => { untrack(() => { detached++; }); }; } };
  onMount(() => { hydrated = true; });
</script>
{const caption = $derived(`${label} key`)}
<main class="p-8" data-hydrated={hydrated}>
  <button>Before keys</button>
  <IconLibraryProvider {library}>
    <div data-gallery="">
      <KbdExample />
      <Kbd data-testid="override" class="h-8 min-w-8 rounded-none px-3 text-sm">Alt</Kbd>
    </div>
  </IconLibraryProvider>
  <button>After keys</button>
  {#if visible}<KbdGroup id="lifecycle-group" bind:ref={groupRef} {...attachment}><Kbd id="lifecycle-kbd" bind:ref {...attachment} class={className} title={caption}>{label}</Kbd></KbdGroup>{/if}
  <button onclick={() => { label = 'Shift'; className = 'px-6'; }}>Update keys</button>
  <button onclick={() => { visible = false; }}>Remove keys</button>
  <output data-testid="kbd-state">{JSON.stringify({ ref: ref?.id ?? null, groupRef: groupRef?.id ?? null, attached, detached })}</output>
</main>
