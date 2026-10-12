<script lang="ts">
  import type { AttachmentGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AttachmentGroupProps = $props();
</script>
<div data-slot="attachment-group" {...props} class={cn('cn-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start', classProp)}>
  {@render children?.()}
</div>
