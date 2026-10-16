<script lang="ts">
  import type { ItemGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemGroupProps = $props();
</script>
<div role="list" data-slot="item-group" {...props} class={cn('cn-item-group group/item-group flex w-full flex-col', classProp)}>
  {@render children?.()}
</div>
