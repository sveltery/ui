<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import FileCode from './code-block/FileCode.svelte';
  import { chatHook, chatRoute } from './code-block/samples';

  const files = [
    {
      id: 'route',
      title: 'app/api/chat/route.ts',
      language: 'ts',
      code: chatRoute,
    },
    {
      id: 'chat',
      title: 'components/chat.tsx',
      language: 'tsx',
      code: chatHook,
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
