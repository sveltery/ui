<script lang="ts">
  import type { Snippet } from 'svelte';
  import InfoIcon from '@lucide/svelte/icons/info';
  import { cn } from 'cn';

  let {
    title,
    icon,
    variant = 'default',
    class: className,
    children,
  }: { title?: string; icon?: Snippet; variant?: 'default' | 'info' | 'warning'; class?: string; children: Snippet } = $props();
</script>

<div
  data-slot="alert"
  data-variant={variant}
  role="alert"
  data-not-typeset
  class={cn(
    'relative mt-6 grid w-auto grid-cols-[0_1fr] items-start gap-y-0.5 rounded-2xl border border-surface bg-surface px-4 py-3 text-sm text-surface-foreground has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 md:-mx-1 **:[a]:font-medium **:[a]:underline **:[a]:decoration-current/30 **:[a]:hover:decoration-current **:[code]:border [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
    className,
  )}
>
  {#if icon}
    {@render icon()}
  {:else if variant === 'info'}
    <InfoIcon class="translate-y-[3px]!" />
  {/if}
  {#if title}<div data-slot="alert-title" class="col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight">{title}</div>{/if}
  <div data-slot="alert-description" class="col-start-2 grid justify-items-start gap-1 text-sm text-card-foreground/80 [&_p]:leading-relaxed">{@render children()}</div>
</div>
