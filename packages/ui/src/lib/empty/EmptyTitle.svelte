<script lang="ts">
  import type { EmptyTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: EmptyTitleProps = $props();
</script>
<div data-slot="empty-title" {...props} class={cn('cn-empty-title cn-font-heading', classProp)}>
  {@render children?.()}
</div>
