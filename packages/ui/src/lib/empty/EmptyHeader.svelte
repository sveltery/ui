<script lang="ts">
  import type { EmptyHeaderProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: EmptyHeaderProps = $props();
</script>
<div data-slot="empty-header" {...props} class={cn('cn-empty-header flex max-w-sm flex-col items-center', classProp)}>
  {@render children?.()}
</div>
