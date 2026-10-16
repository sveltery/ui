<script lang="ts">
  import type { AttachmentContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AttachmentContentProps = $props();
</script>
<div data-slot="attachment-content" {...props} class={cn('cn-attachment-content max-w-full min-w-0 flex-1', classProp)}>
  {@render children?.()}
</div>
