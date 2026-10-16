<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';
  import CodeFigure from './CodeFigure.svelte';

  // `files` comes from the markdown pipeline, which reads the component folder named by `name` at build time.
  let { name, files, requires }: { name: string; files: { title: string; lang: string; html: string; raw: string }[]; requires: string[] } = $props();
  const opened = new SvelteSet<string>();
  const toggle = (title: string) => (opened.has(title) ? opened.delete(title) : opened.add(title));
</script>

<div data-slot="component-source" data-name={name} data-not-typeset class="mt-6">
  {#if requires.length}
    <p class="text-sm text-muted-foreground">
      It imports the
      {#each requires as folder, i (folder)}{i ? (i === requires.length - 1 ? ' and ' : ', ') : ''}<code class="rounded bg-muted px-1 font-mono text-[0.85em]">{folder}</code>{/each}
      {requires.length === 1 ? 'component' : 'components'}, so copy {requires.length === 1 ? 'its folder' : 'their folders'} too.
    </p>
  {/if}
  {#each files as file (file.title)}
    {const open = opened.has(file.title)}
    <div data-state={open ? 'open' : 'closed'} class="group/collapsible relative md:-mx-1">
      <div class="absolute top-1.5 right-9 z-10 flex items-center">
        <button
          type="button"
          aria-expanded={open}
          class="inline-flex h-7 items-center justify-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:hover:bg-accent/50"
          onclick={() => toggle(file.title)}>{open ? 'Collapse' : 'Expand'}</button
        >
        <div data-orientation="vertical" role="none" class="mx-1.5 h-4 w-px shrink-0 bg-border"></div>
      </div>
      <div
        data-state={open ? 'open' : 'closed'}
        class="relative mt-6 overflow-hidden data-[state=closed]:max-h-64 data-[state=closed]:[content-visibility:auto] [&>figure]:mt-0 md:[&>figure]:mx-0!"
      >
        <CodeFigure html={file.html} raw={file.raw} title={file.title} lang={file.lang} class="[&>pre]:max-h-96" />
      </div>
      <button
        type="button"
        tabindex="-1"
        aria-hidden="true"
        class="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-linear-to-b from-code/70 to-code text-sm text-muted-foreground group-data-[state=open]/collapsible:hidden"
        onclick={() => toggle(file.title)}>Expand</button
      >
    </div>
  {/each}
</div>
