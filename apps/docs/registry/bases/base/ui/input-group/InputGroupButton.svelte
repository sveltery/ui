<script lang="ts">
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import type { InputGroupButtonProps } from './types.js';
  import { inputGroupButtonVariants } from './variants.js';
  let { children, class: classProp, type = 'button', variant = 'ghost', size = 'xs', ...props }: InputGroupButtonProps = $props();
</script>
<Button {type} data-size={size} {variant} {...props} class={cn(inputGroupButtonVariants({ size }), classProp)}>
  {@render children?.()}
</Button>
