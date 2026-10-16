<script lang="ts">
  import { PACKAGE_MANAGERS, packageManager, type PackageManager } from '$lib/package-manager.svelte';
  import CodeFigure from './CodeFigure.svelte';
  import CopyButton from './CopyButton.svelte';

  let {
    html = '',
    raw = '',
    title,
    lang,
    collapsible = false,
    commands,
  }: { html?: string; raw?: string; title?: string; lang?: string; collapsible?: boolean; commands?: Record<PackageManager, string> } = $props();

  let open = $state(false);

  $effect(() => packageManager.restore());
</script>

{#if commands}
  <div data-slot="code-block" data-not-typeset class="relative mt-6 -mx-1 overflow-hidden rounded-2xl bg-code font-mono text-sm text-code-foreground first:mt-0">
    <div class="flex items-center gap-2 border-b border-border/50 px-3 py-1">
      <div class="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
        <svg viewBox="0 0 24 24" class="size-3 text-code" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7l5 5l-5 5" /><path d="M12 19l7 0" /></svg>
      </div>
      <div role="tablist" aria-label="Package manager" class="inline-flex h-9 w-fit items-center justify-center text-muted-foreground">
        {#each PACKAGE_MANAGERS as pm (pm)}
          <button
            type="button"
            role="tab"
            aria-selected={packageManager.current === pm}
            class="relative inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 pt-0.5 pb-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-selected:border-input aria-selected:bg-background aria-selected:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:aria-selected:text-foreground"
            onclick={() => packageManager.set(pm)}>{pm}</button
          >
        {/each}
      </div>
    </div>
    <div role="tabpanel" class="no-scrollbar overflow-x-auto px-4 py-3.5">
      <pre><code class="relative font-mono text-sm leading-none" data-language="bash">{commands[packageManager.current]}</code></pre>
    </div>
    <CopyButton value={commands[packageManager.current]} class="top-2 opacity-70" />
  </div>
{:else}
  <CodeFigure {html} {raw} {title} {lang} class={['first:mt-0', collapsible && !open && '[&>pre]:max-h-64 [&>pre]:overflow-y-hidden']}>
    {#if collapsible}
      <button
        type="button"
        aria-expanded={open}
        class="absolute top-1.5 right-10 z-10 inline-flex h-7 items-center justify-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-accent/50"
        onclick={() => (open = !open)}>{open ? 'Collapse' : 'Expand'}</button
      >
      {#if !open}
        <button
          type="button"
          tabindex="-1"
          aria-hidden="true"
          class="absolute inset-x-0 bottom-0 flex h-20 items-center justify-center bg-linear-to-b from-code/70 to-code text-sm text-muted-foreground"
          onclick={() => (open = true)}>Expand</button
        >
      {/if}
    {/if}
  </CodeFigure>
{/if}
