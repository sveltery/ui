<script lang="ts">
  import type { ItemContentProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemContentProps = $props();
</script>
<div data-slot="item-content" {...props} class={cn('cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none', classProp)}>
  {@render children?.()}
</div>
