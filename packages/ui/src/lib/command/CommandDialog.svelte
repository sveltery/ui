<script lang="ts">
  import { cn } from 'cn';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../dialog/index.js';
  import type { CommandDialogProps } from './types.js';
  let {
    open = $bindable(),
    title = 'Command Palette',
    description = 'Search for a command to run...',
    class: classProp,
    showCloseButton = false,
    children,
    ...props
  }: CommandDialogProps = $props();
</script>
<Dialog bind:open {...props}>
  <DialogContent class={cn('cn-command-dialog top-1/3 translate-y-0 overflow-hidden p-0', classProp)} {showCloseButton}>
    <DialogHeader class="sr-only">
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    {@render children()}
  </DialogContent>
</Dialog>
