<script lang="ts">
  import { site } from '$lib/site';
</script>

<footer class="group-has-[.section-soft]/layout:bg-surface/40 dark:bg-transparent dark:group-has-[.section-soft]/layout:bg-surface/40">
  <div class="container-wrapper px-4 xl:px-6">
    <div class="flex h-(--footer-height) items-center justify-between">
      <p class="w-full px-1 text-center text-xs leading-loose text-muted-foreground sm:text-sm">
        A Svelte port of <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" class="font-medium underline underline-offset-4">shadcn/ui</a>, built on <a href="https://base.sveltery.dev" target="_blank" rel="noreferrer" class="font-medium underline underline-offset-4">Sveltery Base</a>. The source code is
        available on <a href={site.github} target="_blank" rel="noreferrer" class="font-medium underline underline-offset-4">GitHub</a>.
      </p>
    </div>
  </div>
</footer>
