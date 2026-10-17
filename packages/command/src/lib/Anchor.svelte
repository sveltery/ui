<script lang="ts">
  import { ANCHOR_PREFIX, type Part } from './parts.svelte.js';

  const { part }: { part: Part } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- a comment around the part's own $props.id() -->
{@html `<!--${ANCHOR_PREFIX}${part.anchor}-->`}
