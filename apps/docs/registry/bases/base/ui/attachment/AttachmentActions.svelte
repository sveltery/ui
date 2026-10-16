<script lang="ts">
  import type { AttachmentActionsProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AttachmentActionsProps = $props();
</script>
<div data-slot="attachment-actions" {...props} class={cn('cn-attachment-actions flex shrink-0 items-center', classProp)}>
  {@render children?.()}
</div>
