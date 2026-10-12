<script lang="ts">
  import type { Component } from 'svelte';
  import { cn } from 'cn';
  import CopyButton from './CopyButton.svelte';

  // `component` and `source` come from the markdown pipeline, which resolves `name` at build time.
  let {
    name,
    component: Example,
    source,
    align = 'center',
    hideCode = false,
    class: className,
  }: {
    name: string;
    component: Component;
    source: { html: string; raw: string };
    align?: 'center' | 'start' | 'end';
    hideCode?: boolean;
    class?: string;
  } = $props();

  let codeVisible = $state(false);
</script>

<div data-slot="component-preview" data-name={name} data-not-typeset class={cn('group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-xl border', className)}>
  <div
    data-slot="preview"
    data-align={align}
    data-pagefind-ignore
    class="no-scrollbar relative flex max-h-[36rem] min-h-72 w-full justify-center overflow-y-auto p-6 data-[align=center]:items-center-safe data-[align=end]:items-end-safe data-[align=start]:items-start sm:p-10 [&_[data-slot=example-wrapper]]:min-h-0 [&_[data-slot=example-wrapper]]:p-0 [&>.w-full]:bg-transparent"
  >
    <Example />
  </div>
  {#if !hideCode}
    <div data-slot="code" class="relative overflow-hidden border-t [&_[data-rehype-pretty-code-figure]]:m-0 [&_[data-rehype-pretty-code-figure]]:rounded-none">
      {#if codeVisible}
        <div class="[&_pre]:max-h-96">{@html source.html}</div>
        <CopyButton value={source.raw} class="right-4" />
      {:else}
        <div class="relative max-h-24 overflow-hidden" aria-hidden="true">{@html source.html}</div>
        <div class="absolute inset-0 flex items-center justify-center bg-linear-to-t from-code via-code/60 to-transparent pt-6">
          <button
            type="button"
            class="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium shadow-none hover:bg-muted"
            onclick={() => (codeVisible = true)}>View Code</button
          >
        </div>
      {/if}
    </div>
  {/if}
</div>
