<script lang="ts">
  import type { CodeBlockTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CodeBlockTitleProps = $props();
</script>
<div data-slot="code-block-title" {...props} class={cn('cn-code-block-title min-w-0 truncate [&_svg]:pointer-events-none [&_svg]:inline-block [&_svg]:align-middle', classProp)}>
  {@render children?.()}
</div>
