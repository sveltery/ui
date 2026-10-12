<script lang="ts">
  import type { CardProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, size = 'default', ...props }: CardProps = $props();
</script>
<div data-slot="card" data-size={size} {...props} class={cn('cn-card group/card flex flex-col', classProp)}>
  {@render children?.()}
</div>
