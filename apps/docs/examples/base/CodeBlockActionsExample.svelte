<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const output = `$ pnpm lint
apps/web/components/message-list.tsx
  18:22  error  'messages' is possibly 'undefined'. Add a guard before calling map  @typescript-eslint/no-unsafe-call
  42:7   warning  React Hook React.useEffect has a missing dependency: 'scrollToBottom'  react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)`;

  function download(value: string, filename: string) {
    const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  let wrap = $state(true);
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        Terminal
      </CodeBlockTitle>
      <CodeBlockActions>
        <Button variant="ghost" size="icon-xs" aria-label="Wrap lines" aria-pressed={wrap} class="aria-pressed:text-foreground" onclick={() => (wrap = !wrap)}>
          <IconPlaceholder lucide="WrapTextIcon" tabler="IconTextWrap" hugeicons="TextWrapIcon" phosphor="ArrowUDownLeftIcon" remixicon="RiTextWrap" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label="Download" onclick={() => download(output, 'lint.log')}>
          <IconPlaceholder lucide="DownloadIcon" tabler="IconDownload" hugeicons="Download01Icon" phosphor="DownloadSimpleIcon" remixicon="RiDownloadLine" />
        </Button>
        <CodeBlockCopyButton value={output} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent {wrap} code={output} />
  </CodeBlock>
</div>
