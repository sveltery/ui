<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuTrigger } from '../dropdown-menu/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof DropdownMenuTrigger> = $props();
</script>
<DropdownMenuTrigger data-slot="menubar-trigger" {children} {...props} class={cn('cn-menubar-trigger flex items-center outline-hidden select-none', classProp)} />
