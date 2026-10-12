<script lang="ts">
  import type { AttachmentMediaProps } from './types.js';
  import { cn } from 'cn';
  import { attachmentMediaVariants } from './variants.js';
  let { children, class: classProp, variant = 'icon', ...props }: AttachmentMediaProps = $props();
</script>
<div data-slot="attachment-media" data-variant={variant} {...props} class={cn(attachmentMediaVariants({ variant }), classProp)}>
  {@render children?.()}
</div>
