<script lang="ts">
  import type { CardTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardTitleProps = $props();
</script>
<div data-slot="card-title" {...props} class={cn('cn-card-title cn-font-heading', classProp)}>
  {@render children?.()}
</div>
