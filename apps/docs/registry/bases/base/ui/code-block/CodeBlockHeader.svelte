<script lang="ts">
  import type { CodeBlockHeaderProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CodeBlockHeaderProps = $props();
</script>
<div data-slot="code-block-header" {...props} class={cn('cn-code-block-header flex min-w-0 shrink-0 items-center *:has-[>[data-slot=code-block-title]]:min-w-0', classProp)}>
  {@render children?.()}
</div>
