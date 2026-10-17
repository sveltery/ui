<script lang="ts">
  import type { CodeBlockActionsProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CodeBlockActionsProps = $props();
</script>
<div
  data-slot="code-block-actions"
  {...props}
  class={cn(
    'cn-code-block-actions ms-auto flex shrink-0 items-center [[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100',
    classProp,
  )}
>
  {@render children?.()}
</div>
