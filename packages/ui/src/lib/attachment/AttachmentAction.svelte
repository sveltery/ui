<script lang="ts">
  import { Button } from '../button/index.js';
  import type { AttachmentActionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, variant = 'ghost', size = 'icon-xs', ...props }: AttachmentActionProps = $props();
</script>
<Button data-slot="attachment-action" {...props} {variant} {size} {children} class={cn('cn-attachment-action', classProp)} />
