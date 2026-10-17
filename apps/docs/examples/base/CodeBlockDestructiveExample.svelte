<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';

  const error = `TypeError: Cannot read properties of undefined (reading 'map')
    at MessageList (components/message-list.tsx:18:22)
    at renderWithHooks (react-dom.development.js:16305:18)`;
</script>

<div class="w-full max-w-md">
  <CodeBlock variant="destructive">
    <CodeBlockHeader>
      <CodeBlockTitle>Error</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={error} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent wrap code={error} />
  </CodeBlock>
</div>
