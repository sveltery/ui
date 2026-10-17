<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';

  type Block = {
    title?: string;
    language: string;
    code: string;
    lineNumbers?: boolean;
    highlight?: number[];
    diff?: boolean;
  };

  let { block, code }: { block: Block; code: string } = $props();

  const rows = $derived(code.split('\n'));
  // A diff row starts with +, - or a space. The marker is not part of the code.
  const source = $derived(block.diff ? rows.map((row) => row.slice(1)).join('\n') : code);
  const highlighted = useHighlightedCode(() => source, () => block.language);

  function getVariant(index: number) {
    if (block.diff) {
      if (rows[index]?.startsWith('+')) return 'added';
      if (rows[index]?.startsWith('-')) return 'removed';
      return 'default';
    }
    return block.highlight?.includes(index) ? 'highlighted' : 'default';
  }
</script>

<CodeBlock>
  {#if block.title}
    <CodeBlockHeader>
      <CodeBlockTitle>{block.title}</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={source} disabled={code.length < block.code.length} />
      </CodeBlockActions>
    </CodeBlockHeader>
  {/if}
  <CodeBlockContent lineNumbers={block.lineNumbers}>
    {#each highlighted.lines as line, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
      <CodeBlockLine variant={getVariant(index)}>{@html line}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>
