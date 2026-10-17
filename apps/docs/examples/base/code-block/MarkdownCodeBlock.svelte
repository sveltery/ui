<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';

  // `incomplete` is true while the closing fence has not arrived yet.
  let { code, language, incomplete }: { code: string; language: string; incomplete: boolean } = $props();

  const highlighted = useHighlightedCode(() => code, () => language);
</script>

<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>{language || 'text'}</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value={code} disabled={incomplete} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent>
    {#each highlighted.lines as line, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
      <CodeBlockLine>{@html line}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>
