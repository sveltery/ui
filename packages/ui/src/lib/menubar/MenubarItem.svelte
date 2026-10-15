<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuItem } from '../dropdown-menu/index.js';
  let { children, class: classProp, inset, variant = 'default', ...props }: ComponentProps<typeof DropdownMenuItem> = $props();
</script>
<DropdownMenuItem data-slot="menubar-item" data-inset={inset} data-variant={variant} {children} {...props} class={cn('cn-menubar-item group/menubar-item', classProp)} />
