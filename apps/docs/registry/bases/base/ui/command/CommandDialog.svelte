<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import { cn } from 'cn';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog/index.js';
  let {
    open = $bindable(),
    title = 'Command Palette',
    description = 'Search for a command to run...',
    class: classProp,
    showCloseButton = false,
    children,
    ...props
  }: Omit<ComponentProps<typeof Dialog>, 'children'> & {
    title?: string;
    description?: string;
    class?: string;
    showCloseButton?: boolean;
    children: Snippet;
  } = $props();
</script>
<Dialog bind:open {...props}>
  <DialogHeader class="sr-only">
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>{description}</DialogDescription>
  </DialogHeader>
  <DialogContent class={cn('cn-command-dialog top-1/3 translate-y-0 overflow-hidden p-0', classProp)} {showCloseButton}>
    {@render children()}
  </DialogContent>
</Dialog>
