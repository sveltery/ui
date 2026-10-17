<script lang="ts">
  import { cn } from 'cn';
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div data-slot="card-footer" class={cn('flex items-center px-6 [.border-t]:pt-6', className)} {...rest}>{@render children?.()}</div>
