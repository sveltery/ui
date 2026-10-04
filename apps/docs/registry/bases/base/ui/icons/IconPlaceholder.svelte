<script lang="ts">
  import type { IconPlaceholderProps } from './types.js';
  import { getIconLibraryContext } from './config.js';
  import { loadIcon, loadedIcon } from './data.js';
  import IconSvg from './IconSvg.svelte';
  import fallback from './generated/fallback.js';
  // Pinned original d75a96ab icon children have no empty HTML text siblings.
  // Svelte 5.57.1 standalone branch fragments create empty Text ownership anchors.
  // Five constant-empty HTML encodings retain comment-only template ownership,
  // preserving every original condition/await and all loader/cache behavior.
  let { children, ref = $bindable(), ...props }: IconPlaceholderProps = $props();
  const getLibrary = getIconLibraryContext();
  const library = $derived(getLibrary());
  const name = $derived(props[library]);
  const available = $derived(name ? loadedIcon(library, name) : null);
  const pending = $derived(available === undefined && name ? loadIcon(library, name) : null);
</script>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html ''}{#if name}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html ''}{#if available !== undefined}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html ''}{#if available}<IconSvg data={available} {library} attributes={props} {children} bind:ref />{/if}
  {:else}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html ''}{#await pending}
      <IconSvg data={fallback} library="fallback" attributes={props} {children} bind:ref />
    {:then data}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html ''}{#if data}<IconSvg {data} {library} attributes={props} {children} bind:ref />{/if}
    {/await}
  {/if}
{/if}
