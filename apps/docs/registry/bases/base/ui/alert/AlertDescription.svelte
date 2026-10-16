<script lang="ts">
  import type { AlertDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AlertDescriptionProps = $props();
</script>
<div data-slot="alert-description" {...props} class={cn('cn-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground', classProp)}>
  {@render children?.()}
</div>
