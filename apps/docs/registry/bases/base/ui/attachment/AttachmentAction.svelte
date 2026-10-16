<script lang="ts">
  import { Button } from '../button/index.js';
  import type { AttachmentActionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, variant, size = 'icon-xs', ...props }: AttachmentActionProps = $props();
</script>
<Button data-slot="attachment-action" {...props} variant={variant ?? 'ghost'} {size} {children} class={cn('cn-attachment-action', classProp)} />
