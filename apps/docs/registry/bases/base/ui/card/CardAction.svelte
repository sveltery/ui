<script lang="ts">
  import type { CardActionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardActionProps = $props();
</script>
<div data-slot="card-action" {...props} class={cn('cn-card-action col-start-2 row-span-2 row-start-1 self-start justify-self-end', classProp)}>
  {@render children?.()}
</div>
