<script lang="ts">
  import type { EmptyDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: EmptyDescriptionProps = $props();
</script>
<div data-slot="empty-description" {...props} class={cn('cn-empty-description text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)}>
  {@render children?.()}
</div>
