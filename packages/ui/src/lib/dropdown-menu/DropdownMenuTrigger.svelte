<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="dropdown-menu-trigger" {children} {...props} />
