<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  // Base 2984bb24 Portal takes no host attributes, so the pinned data-slot="dialog-portal" is blocked on Base.
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal {...props}>
  {@render children?.()}
</Primitive.Portal>
