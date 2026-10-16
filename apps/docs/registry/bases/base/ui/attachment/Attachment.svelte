<script lang="ts">
  import type { AttachmentProps } from './types.js';
  import { cn } from 'cn';
  import { attachmentVariants } from './variants.js';
  let { children, class: classProp, state = 'done', size = 'default', orientation = 'horizontal', ...props }: AttachmentProps = $props();
</script>
<div data-slot="attachment" data-state={state} data-size={size} data-orientation={orientation} {...props} class={cn(attachmentVariants({ size, orientation }), classProp)}>
  {@render children?.()}
</div>
