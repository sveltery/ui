<script lang="ts">
  import type { CardHeaderProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardHeaderProps = $props();
</script>
<div data-slot="card-header" {...props} class={cn('cn-card-header group/card-header @container/card-header grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]', classProp)}>
  {@render children?.()}
</div>
