<script lang="ts">
  import { cn } from 'cn';
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div data-slot="card-content" class={cn('px-6', className)} {...rest}>{@render children?.()}</div>
