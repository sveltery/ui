<script lang="ts">
  import type { Icon } from './options';

  let { icon, class: className }: { icon: Icon; class?: string } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} fill="none" aria-hidden="true" class={className}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static markup authored in options.ts -->
  {@html icon.body}
</svg>
