<script lang="ts">
  import type { AttachmentTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AttachmentTitleProps = $props();
</script>
<span data-slot="attachment-title" {...props} class={cn('cn-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer', classProp)}>
  {@render children?.()}
</span>
