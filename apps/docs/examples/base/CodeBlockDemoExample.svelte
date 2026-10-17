<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
    useHighlightedCode,
  } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

  function download(value: string, filename: string) {
    const url = URL.createObjectURL(new Blob([value], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  let wrap = $state(false);
  const highlighted = useHighlightedCode(() => code, () => 'ts');
</script>

<div class="w-full max-w-lg">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="FileCodeIcon" remixicon="RiFileCodeLine" />
        app/api/chat/route.ts
      </CodeBlockTitle>
      <CodeBlockActions>
        <Button variant="ghost" size="icon-xs" aria-label="Wrap lines" aria-pressed={wrap} class="aria-pressed:text-foreground" onclick={() => (wrap = !wrap)}>
          <IconPlaceholder lucide="WrapTextIcon" tabler="IconTextWrap" hugeicons="TextWrapIcon" phosphor="ArrowUDownLeftIcon" remixicon="RiTextWrap" />
        </Button>
        <Button variant="ghost" size="icon-xs" aria-label="Download" onclick={() => download(code, 'route.ts')}>
          <IconPlaceholder lucide="DownloadIcon" tabler="IconDownload" hugeicons="Download01Icon" phosphor="DownloadSimpleIcon" remixicon="RiDownloadLine" />
        </Button>
        <CodeBlockCopyButton value={code} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent {wrap} lineNumbers>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine variant={index >= 5 && index <= 9 ? 'highlighted' : 'default'}>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
