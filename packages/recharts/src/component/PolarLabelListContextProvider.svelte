<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PolarLabelListEntry } from './LabelList.js';
  import { setPolarLabelListContext } from './LabelList.hooks.svelte.js';

  let { value, children }: { value: ReadonlyArray<PolarLabelListEntry> | undefined; children?: Snippet } = $props();
  setPolarLabelListContext({
    get current() {
      return value;
    },
  });
</script>

{@render children?.()}
