<script lang="ts">
  // Derived from pinned shadcn AspectRatio; source hashes and MIT: tests/reference/aspect-ratio-sources.json.
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { classes } from '../shared/classes.js';
  let { ratio, children, class: classProp, ref = $bindable(), ...props }: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & { ratio: number; children?: Snippet; ref?: HTMLDivElement | null } = $props();
  // Upstream spreads caller style after --ratio: replacement, including explicit undefined/null.
  const style = $derived('style' in props ? props.style || undefined : `--ratio: ${ratio};`);
</script>
<div data-slot="aspect-ratio" {...props} {style} class={classes('relative aspect-(--ratio)', classProp)} bind:this={ref}>
  {@render children?.()}
</div>
