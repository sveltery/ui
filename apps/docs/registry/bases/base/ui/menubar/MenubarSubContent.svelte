<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuSubContent } from '../dropdown-menu/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof DropdownMenuSubContent> = $props();
</script>
<DropdownMenuSubContent data-slot="menubar-sub-content" {children} {...props} class={cn('cn-menubar-sub-content cn-menu-target cn-menu-translucent', classProp)} />
