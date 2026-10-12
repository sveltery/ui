<script lang="ts">
  import type { IconPlaceholderProps } from './types.js';
  import { getIconLibraryContext } from './config.js';
  import { icons } from './generated.js';
  let { lucide, tabler, hugeicons, phosphor, remixicon, class: className, ...props }: IconPlaceholderProps = $props();
  const library = getIconLibraryContext();
  const icon = $derived(icons[library()][{ lucide, tabler, hugeicons, phosphor, remixicon }[library()]]);
</script>
{#if icon}
  <svg {...icon.attributes} {...props} class={[icon.attributes.class, className]}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- geometry generated at build time from the icon packages -->
    {@html icon.body}
  </svg>
{/if}
