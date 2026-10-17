<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import CopyButton from './CopyButton.svelte';
  import LanguageIcon from './LanguageIcon.svelte';

  let { html, raw, title, lang, class: className, children }: { html: string; raw: string; title?: string; lang?: string; class?: ClassValue; children?: Snippet } = $props();
</script>

<figure data-rehype-pretty-code-figure data-not-typeset class={className}>
  {#if title}
    <figcaption data-rehype-pretty-code-title data-language={lang} class="flex items-center gap-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70">
      <LanguageIcon language={lang} />
      {title}
    </figcaption>
  {/if}
  <CopyButton value={raw} />
  {@html html}
  {@render children?.()}
</figure>
