<script lang="ts">
  import type { ItemTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemTitleProps = $props();
</script>
<div data-slot="item-title" {...props} class={cn('cn-item-title line-clamp-1 flex w-fit items-center', classProp)}>
  {@render children?.()}
</div>
