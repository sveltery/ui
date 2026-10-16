<script lang="ts">
  import type { CardDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: CardDescriptionProps = $props();
</script>
<div data-slot="card-description" {...props} class={cn('cn-card-description', classProp)}>
  {@render children?.()}
</div>
