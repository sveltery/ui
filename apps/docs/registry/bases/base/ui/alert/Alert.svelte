<script lang="ts">
  import type { AlertProps } from './types.js';
  import { cn } from 'cn';
  import { alertVariants } from './variants.js';
  let { children, class: classProp, variant, ...props }: AlertProps = $props();
</script>
<div data-slot="alert" role="alert" {...props} class={cn(alertVariants({ variant }), classProp)}>
  {@render children?.()}
</div>
