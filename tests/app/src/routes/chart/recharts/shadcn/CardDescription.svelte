<script lang="ts">
  import { cn } from 'cn';
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div data-slot="card-description" class={cn('text-sm text-muted-foreground', className)} {...rest}>{@render children?.()}</div>
