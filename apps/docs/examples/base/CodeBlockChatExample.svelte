<script lang="ts">
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';

  const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`;

  const highlighted = useHighlightedCode(() => code, () => 'ts');
</script>

<div class="flex w-full max-w-md flex-col gap-4 text-sm">
  <Message align="end">
    <MessageContent>
      <Bubble variant="muted">
        <BubbleContent>How do I stream a response?</BubbleContent>
      </Bubble>
    </MessageContent>
  </Message>
  <Message>
    <MessageContent class="gap-3">
      <p>Create a route handler that returns the stream:</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>
          {#each highlighted.lines as line, index (index)}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
            <CodeBlockLine>{@html line}</CodeBlockLine>
          {/each}
        </CodeBlockContent>
      </CodeBlock>
      <p>The client reads it with useChat.</p>
    </MessageContent>
  </Message>
</div>
