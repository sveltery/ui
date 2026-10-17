<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`;

  const highlighted = useHighlightedCode(() => code, () => 'ts');
</script>

<div class="typeset w-full max-w-md">
  <h3>Stream a response</h3>
  <p>Create a route handler that calls <code>streamText</code> and returns the stream to the client.</p>
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="FileCodeIcon" remixicon="RiFileCodeLine" />
        app/api/chat/route.ts
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={code} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent lineNumbers>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
  <p>The <code>useChat</code> hook reads the stream on the client and renders the answer while it is written.</p>
</div>
