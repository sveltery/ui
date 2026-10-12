<script lang="ts">
  import type { CardContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardContentProps = $props();
</script>
<div data-slot="card-content" {...props} class={cn('cn-card-content', classProp)}>
  {@render children?.()}
</div>
