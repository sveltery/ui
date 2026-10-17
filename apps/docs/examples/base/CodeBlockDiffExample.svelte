<script lang="ts">
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle } from '$registry/bases/base/ui/code-block';

  const patch = ` export function Greeting({ name }: { name: string }) {
-  return <p>Hello, {name}</p>
+  return <p className="text-sm text-muted-foreground">
+    Hello, {name}!
+  </p>
 }`;

  function getVariant(line: string) {
    if (line.startsWith('+')) {
      return 'added';
    }

    if (line.startsWith('-')) {
      return 'removed';
    }

    return 'default';
  }
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value={patch} />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent>
      {#each patch.split('\n') as line, index (index)}
        <CodeBlockLine variant={getVariant(line)}>{line.slice(1)}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
