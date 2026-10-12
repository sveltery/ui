<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Popover as Primitive } from '@sveltery/base/popover';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="popover-trigger" {children} {...props} />
