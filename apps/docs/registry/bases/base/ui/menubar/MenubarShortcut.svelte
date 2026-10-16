<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuShortcut } from '../dropdown-menu/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof DropdownMenuShortcut> = $props();
</script>
<DropdownMenuShortcut data-slot="menubar-shortcut" {children} {...props} class={cn('cn-menubar-shortcut ml-auto', classProp)} />
