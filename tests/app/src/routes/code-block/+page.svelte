<script lang="ts">
  import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockLine,
    useHighlightedCode,
  } from '$registry/bases/base/ui/code-block';

  const plain = 'const a = 1;\n\nconst b = 2;';
  const patch = ' keep\n-old\n+new\n \n+last';
  let source = $state('<script>window.injected = true<' + '/script>\n<p class="note">Hi</p>');
  const highlighted = useHighlightedCode(() => source, () => 'html');
  const variant = (line: string) => (line.startsWith('+') ? 'added' : line.startsWith('-') ? 'removed' : 'default');
</script>

<CodeBlock data-testid="plain">
  <CodeBlockActions>
    <CodeBlockCopyButton value={plain} />
  </CodeBlockActions>
  <CodeBlockContent lineNumbers code={plain} />
</CodeBlock>

<CodeBlock data-testid="diff">
  <CodeBlockContent lineNumbers>
    {#each patch.split('\n') as line, index (index)}
      <CodeBlockLine variant={variant(line)}>{line.slice(1)}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>

<CodeBlock data-testid="highlighted">
  <CodeBlockContent>
    {#each highlighted.lines as line, index (index)}
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
      <CodeBlockLine>{@html line}</CodeBlockLine>
    {/each}
  </CodeBlockContent>
</CodeBlock>
<button type="button" onclick={() => (source += '\n<b>more</b>')}>Append</button>
