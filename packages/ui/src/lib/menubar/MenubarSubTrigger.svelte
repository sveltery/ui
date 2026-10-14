<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuSubTrigger } from '../dropdown-menu/index.js';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof DropdownMenuSubTrigger> = $props();
</script>
<DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {children} {inset} {...props} class={cn('cn-menubar-sub-trigger', classProp)} />
