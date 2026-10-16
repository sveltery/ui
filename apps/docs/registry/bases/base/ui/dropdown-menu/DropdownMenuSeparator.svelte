<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Separator> = $props();
</script>
<Primitive.Separator data-slot="dropdown-menu-separator" {...props} class={cn('cn-dropdown-menu-separator', classProp)} />
