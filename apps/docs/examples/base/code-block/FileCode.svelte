<script lang="ts">
  import { CodeBlockContent, CodeBlockLine, useHighlightedCode } from '$registry/bases/base/ui/code-block';

  let { code, language }: { code: string; language: string } = $props();

  const highlighted = useHighlightedCode(() => code, () => language);
</script>

<CodeBlockContent lineNumbers>
  {#each highlighted.lines as line, index (index)}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
    <CodeBlockLine>{@html line}</CodeBlockLine>
  {/each}
</CodeBlockContent>
