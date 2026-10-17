<script lang="ts">
  import type { CodeBlockProps } from './types.js';
  import { cn } from 'cn';
  import { codeBlockVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', size = 'default', ...props }: CodeBlockProps = $props();
</script>
<div data-slot="code-block" data-variant={variant} data-size={size} {...props} class={cn(codeBlockVariants({ variant }), classProp)}>
  {@render children?.()}
</div>
