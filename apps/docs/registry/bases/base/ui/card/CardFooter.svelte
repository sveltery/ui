<script lang="ts">
  import type { CardFooterProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardFooterProps = $props();
</script>
<div data-slot="card-footer" {...props} class={cn('cn-card-footer flex items-center', classProp)}>
  {@render children?.()}
</div>
