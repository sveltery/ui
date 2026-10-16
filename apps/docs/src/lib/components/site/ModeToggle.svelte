<script lang="ts">
  import { mode } from '$lib/theme.svelte';

  // Upstream's D shortcut. Runs on window after page handlers, so one that already handled the key (the Create page's) wins.
  function keydown(event: KeyboardEvent) {
    if (event.key !== 'd' && event.key !== 'D') return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target;
    if ((target instanceof HTMLElement && target.isContentEditable) || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;
    event.preventDefault();
    mode.toggle();
  }
</script>

<svelte:window onkeydown={keydown} />

<button
  type="button"
  class="group/toggle extend-touch-target inline-flex size-8 shrink-0 items-center justify-center rounded-md outline-none transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-accent/50"
  onclick={() => mode.toggle()}
>
  <svg viewBox="0 0 24 24" class="size-4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 3l0 18" />
    <path d="M12 9l4.65 -4.65" />
    <path d="M12 14.3l7.37 -7.37" />
    <path d="M12 19.6l8.85 -8.85" />
  </svg>
  <span class="sr-only">Toggle theme</span>
</button>
