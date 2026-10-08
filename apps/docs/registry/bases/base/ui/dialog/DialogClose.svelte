<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  let { children, ...props }: ComponentProps<typeof Primitive.Close> = $props();
</script>
<Primitive.Close data-slot="dialog-close" {children} {...props} />
