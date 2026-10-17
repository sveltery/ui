<script lang="ts">
  import type { CodeBlockFooterProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CodeBlockFooterProps = $props();
</script>
<div data-slot="code-block-footer" {...props} class={cn('cn-code-block-footer flex min-w-0 shrink-0 items-center', classProp)}>
  {@render children?.()}
</div>
