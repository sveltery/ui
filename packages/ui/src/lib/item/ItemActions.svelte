<script lang="ts">
  import type { ItemActionsProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemActionsProps = $props();
</script>
<div data-slot="item-actions" {...props} class={cn('cn-item-actions flex items-center', classProp)}>
  {@render children?.()}
</div>
