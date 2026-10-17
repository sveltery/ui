<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const output = `$ pnpm test
\x1b[32m✓\x1b[39m src/format.test.ts \x1b[2m(4 tests)\x1b[22m
\x1b[32m✓\x1b[39m src/parse.test.ts \x1b[2m(7 tests)\x1b[22m
\x1b[31m✗\x1b[39m src/stream.test.ts \x1b[2m(3 tests | 1 failed)\x1b[22m

\x1b[31mAssertionError: expected 'hello' to be 'hello world'\x1b[39m

Tests  \x1b[31m1 failed\x1b[39m | \x1b[32m13 passed\x1b[39m (14)`;

  const highlighted = useHighlightedCode(() => output, () => 'ansi');
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        Terminal
      </CodeBlockTitle>
      <CodeBlockActions>
        <!-- eslint-disable-next-line no-control-regex -->
        <CodeBlockCopyButton value={output.replace(/\x1b\[[\d;]*m/g, '')} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent wrap>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
