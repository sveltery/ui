<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import FileCode from './code-block/FileCode.svelte';

  const files = [
    {
      id: 'route',
      title: 'app/api/chat/route.ts',
      language: 'ts',
      code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`,
    },
    {
      id: 'chat',
      title: 'components/chat.tsx',
      language: 'tsx',
      code: `"use client"

import { useChat } from "@ai-sdk/react"

export function Chat() {
  const { messages } = useChat()

  return <MessageList messages={messages} />
}`,
    },
    {
      id: 'env',
      title: '.env.local',
      language: 'bash',
      code: 'AI_GATEWAY_API_KEY=your-api-key',
    },
  ];
</script>

<Tabs value="route" class="w-full max-w-md">
  <TabsList>
    {#each files as file (file.id)}
      <TabsTrigger value={file.id}>{file.title.split('/').at(-1)}</TabsTrigger>
    {/each}
  </TabsList>
  {#each files as file (file.id)}
    <TabsContent value={file.id}>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>{file.title}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={file.code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <FileCode code={file.code} language={file.language} />
      </CodeBlock>
    </TabsContent>
  {/each}
</Tabs>
