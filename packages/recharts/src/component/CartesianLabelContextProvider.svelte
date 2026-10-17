<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TrapezoidViewBox } from '../util/types.js';
  import { setCartesianLabelContext } from './Label.hooks.svelte.js';

  let { x, y, upperWidth, lowerWidth, width, height, children }: TrapezoidViewBox & { children?: Snippet } = $props();
  const viewBox: TrapezoidViewBox = $derived({ x, y, upperWidth, lowerWidth, width, height });
  setCartesianLabelContext({
    get current() {
      return viewBox;
    },
  });
</script>

{@render children?.()}
