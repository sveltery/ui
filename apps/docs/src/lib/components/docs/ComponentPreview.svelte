<script lang="ts">
  import type { Component } from 'svelte';
  import { cn } from 'cn';
  import CodeFigure from './CodeFigure.svelte';

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
    source: { html: string; peek: string; raw: string };
    align?: 'center' | 'start' | 'end';
    hideCode?: boolean;
    class?: string;
  } = $props();

  let codeVisible = $state(false);
</script>

<div data-slot="component-preview" data-name={name} data-not-typeset class={cn('group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-2xl border', className)}>
  <div
    data-slot="preview"
    data-align={align}
    data-pagefind-ignore
    class="no-scrollbar relative flex max-h-[36rem] min-h-72 w-full justify-center overflow-y-auto p-6 data-[align=center]:items-center-safe data-[align=end]:items-end-safe data-[align=start]:items-start sm:p-10 [&_[data-slot=example-wrapper]]:min-h-0 [&_[data-slot=example-wrapper]]:p-0 [&_[data-slot=example-wrapper]]:flex! [&_[data-slot=example-wrapper]]:flex-col max-sm:[&_[data-slot=example-content]]:p-6 [&>.w-full]:bg-transparent"
  >
    <Example />
  </div>
  {#if !hideCode}
    <div
      data-slot="code"
      data-code-visible={codeVisible}
      class="relative overflow-hidden **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
    >
      {#if codeVisible}
        <CodeFigure html={source.html} raw={source.raw} />
      {:else}
        <div class="relative">
          <CodeFigure html={source.peek} raw={source.raw} />
          <div class="absolute inset-0 flex items-center justify-center pb-4">
            <div class="absolute inset-0" style="background: linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)"></div>
            <button
              type="button"
              class="relative z-10 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium whitespace-nowrap text-foreground shadow-none transition-all outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-input dark:bg-background dark:text-foreground dark:hover:bg-muted"
              onclick={() => (codeVisible = true)}>View Code</button
            >
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
