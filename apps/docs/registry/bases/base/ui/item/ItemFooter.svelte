<script lang="ts">
  import type { ItemFooterProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemFooterProps = $props();
</script>
<div data-slot="item-footer" {...props} class={cn('cn-item-footer flex basis-full items-center justify-between', classProp)}>
  {@render children?.()}
</div>
