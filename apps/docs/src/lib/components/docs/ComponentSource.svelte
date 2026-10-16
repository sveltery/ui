<script lang="ts">
  import CopyButton from './CopyButton.svelte';

  // `files` comes from the markdown pipeline, which reads the component folder named by `name` at build time.
  let { name, files, requires }: { name: string; files: { title: string; html: string; raw: string }[]; requires: string[] } = $props();
  let expanded = $state(false);
</script>

<div data-slot="component-source" data-name={name} data-not-typeset class="mt-6 flex flex-col gap-4">
  <p class="text-sm text-muted-foreground">
    These files use the Nova style and Lucide icons. <code class="rounded bg-muted px-1 font-mono text-[0.85em]">npx @sveltery/ui@latest add</code> writes the style and icon library from your <code class="rounded bg-muted px-1 font-mono text-[0.85em]">components.json</code>.
  </p>
  {#if requires.length}
    <p class="text-sm text-muted-foreground">
      It imports the
      {#each requires as folder, i (folder)}{i ? (i === requires.length - 1 ? ' and ' : ', ') : ''}<code class="rounded bg-muted px-1 font-mono text-[0.85em]">{folder}</code>{/each}
      {requires.length === 1 ? 'component' : 'components'}, so copy {requires.length === 1 ? 'its folder' : 'their folders'} too.
    </p>
  {/if}
  {#each files as file (file.title)}
    <div class="relative overflow-hidden rounded-xl [&_[data-rehype-pretty-code-figure]]:mt-0 {expanded ? '' : '[&_pre]:max-h-64'}">
      {@html file.html}
      <CopyButton value={file.raw} class="top-1.5" />
    </div>
  {/each}
  <button type="button" class="self-center rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted" onclick={() => (expanded = !expanded)}>
    {expanded ? 'Collapse' : 'Expand'}
  </button>
</div>
