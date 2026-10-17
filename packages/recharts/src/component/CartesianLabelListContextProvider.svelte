<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CartesianLabelListEntry } from './LabelList.js';
  import { setCartesianLabelListContext } from './LabelList.hooks.svelte.js';

  let { value, children }: { value: ReadonlyArray<CartesianLabelListEntry> | undefined; children?: Snippet } = $props();
  setCartesianLabelListContext({
    get current() {
      return value;
    },
  });
</script>

{@render children?.()}
