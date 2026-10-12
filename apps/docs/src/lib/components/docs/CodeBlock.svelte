<script lang="ts">
  import { PACKAGE_MANAGERS, packageManager, type PackageManager } from '$lib/package-manager.svelte';
  import CopyButton from './CopyButton.svelte';

  type Code = { html: string; raw: string };
  let { html, raw, commands }: Code & { commands?: Record<PackageManager, Code> } = $props();

  $effect(() => packageManager.restore());

  const shown = $derived(commands?.[packageManager.current] ?? { html, raw });
</script>

<div data-slot="code-block" data-not-typeset class="relative mt-6 first:mt-0 [&_[data-rehype-pretty-code-figure]]:mt-0">
  {#if commands}
    <div class="overflow-hidden rounded-xl bg-code">
      <div role="tablist" aria-label="Package manager" class="flex gap-1 border-b border-border/50 px-3 py-1.5 font-mono text-sm">
        {#each PACKAGE_MANAGERS as pm (pm)}
          <button
            type="button"
            role="tab"
            aria-selected={packageManager.current === pm}
            class="rounded-md px-2 py-0.5 text-muted-foreground aria-selected:bg-background aria-selected:text-foreground aria-selected:shadow-xs dark:aria-selected:bg-muted"
            onclick={() => packageManager.set(pm)}>{pm}</button
          >
        {/each}
      </div>
      <div role="tabpanel" class="[&_[data-rehype-pretty-code-figure]]:rounded-none">{@html shown.html}</div>
    </div>
    <CopyButton value={shown.raw} class="top-1.5" />
  {:else}
    {@html html}
    <CopyButton value={raw} />
  {/if}
</div>
