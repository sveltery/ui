<script lang="ts">
  import type { AttachmentDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AttachmentDescriptionProps = $props();
</script>
<span data-slot="attachment-description" {...props} class={cn('cn-attachment-description block min-w-0 truncate text-muted-foreground group-data-[state=error]/attachment:text-destructive/80 max-w-full', classProp)}>
  {@render children?.()}
</span>
