<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="dialog-portal" {...props}>
  {@render children?.()}
</Primitive.Portal>
