<script lang="ts">
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';

  const code = `{
  "name": "chat",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`;
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockContent lineNumbers {code} />
  </CodeBlock>
</div>
