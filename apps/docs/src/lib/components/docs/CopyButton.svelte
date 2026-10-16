<script lang="ts">
  import { cn } from 'cn';

  let { value, class: className }: { value: string; class?: string } = $props();
  let copied = $state(false);

  function copyWithTextarea() {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(textarea);
    textarea.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      textarea.remove();
    }
  }

  async function copy() {
    copied = await navigator.clipboard?.writeText(value).then(() => true, copyWithTextarea) ?? copyWithTextarea();
    if (copied) setTimeout(() => (copied = false), 2000);
  }
</script>

<button
  type="button"
  data-slot="copy-button"
  data-copied={copied}
  class={cn(
    'absolute top-3 right-2 z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-code transition-all outline-none hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-accent/50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    className,
  )}
  onclick={copy}
>
  <span class="sr-only">Copy</span>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {#if copied}
      <path d="M5 12l5 5l10 -10" />
    {:else}
      <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
      <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
    {/if}
  </svg>
</button>
