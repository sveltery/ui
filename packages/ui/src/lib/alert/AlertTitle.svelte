<script lang="ts">
  import type { AlertTitleProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AlertTitleProps = $props();
</script>
<div data-slot="alert-title" {...props} class={cn('cn-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground', classProp)}>
  {@render children?.()}
</div>
