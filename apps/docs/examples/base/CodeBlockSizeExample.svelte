<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const output = `$ pnpm add ai @ai-sdk/react zod
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`;
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        Terminal
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={output} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent wrap code={output} />
  </CodeBlock>
  <CodeBlock size="sm">
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        Terminal
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={output} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent wrap code={output} />
  </CodeBlock>
</div>
