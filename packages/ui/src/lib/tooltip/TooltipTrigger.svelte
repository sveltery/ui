<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Tooltip as Primitive } from '@sveltery/base/tooltip';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="tooltip-trigger" {children} {...props} />
