<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Size } from '../util/types.js';
  import { isPositiveNumber } from '../util/isWellBehavedNumber.js';
  import { setResponsiveContainerContext } from './ResponsiveContainer.hooks.js';

  let { children, width, height }: { children?: Snippet; width: number | undefined; height: number | undefined } = $props();
  // Children render only once the size is known, so a chart never measures itself at zero.
  const size = $derived({ width, height });
  const isAcceptableSize = (value: { width: number | undefined; height: number | undefined }): value is Size =>
    isPositiveNumber(value.width) && isPositiveNumber(value.height);
  setResponsiveContainerContext({
    get current() {
      return size as Size;
    },
  });
</script>

{#if isAcceptableSize(size)}
  {@render children?.()}
{/if}
