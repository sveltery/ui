<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';
  import { getIconLibraryContext, type IconLibraryName } from './config.js';
  import { loadIcon, loadedIcon } from './data.js';
  import IconSvg from './IconSvg.svelte';
  import fallback from './data/fallback.json' with { type: 'json' };
  type Props = Record<IconLibraryName, string> & Omit<SVGAttributes<SVGSVGElement>, 'children'> & { children?: Snippet; ref?: SVGSVGElement | null; strokeWidth?: string | number | null };
  let { children, ref = $bindable(), ...props }: Props = $props();
  const getLibrary = getIconLibraryContext();
  const library = $derived(getLibrary());
  const name = $derived(props[library]);
  const available = $derived(name ? loadedIcon(library, name) : null);
  const pending = $derived(available === undefined && name ? loadIcon(library, name) : null);
</script>
{#if name}
  {#if available !== undefined}
    {#if available}<IconSvg data={available} {library} attributes={props} {children} bind:ref />{/if}
  {:else}
    {#await pending}
      <IconSvg data={fallback} library="fallback" attributes={props} {children} bind:ref />
    {:then data}
      {#if data}<IconSvg {data} {library} attributes={props} {children} bind:ref />{/if}
    {/await}
  {/if}
{/if}
