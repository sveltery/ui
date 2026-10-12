<script lang="ts">
  import type { ItemHeaderProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemHeaderProps = $props();
</script>
<div data-slot="item-header" {...props} class={cn('cn-item-header flex basis-full items-center justify-between', classProp)}>
  {@render children?.()}
</div>
