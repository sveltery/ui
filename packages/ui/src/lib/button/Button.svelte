<script lang="ts">
  import { Button as Primitive } from '@sveltery/base/button';
  import type { ButtonProps } from './types.js';
  import { buttonVariants } from './variants.js';
  import { cn } from 'cn';
  let { children, class: classProp, variant = 'default', size = 'default', ...props }: ButtonProps = $props();
</script>
<Primitive data-slot="button" {...props} {children} class={cn(buttonVariants({ variant, size }), classProp)} />
