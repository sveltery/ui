<script lang="ts">
  import { CodeBlock, CodeBlockContent, CodeBlockLine } from '$registry/bases/base/ui/code-block';

  const code = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`;

  const highlighted = [2, 3];
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockContent lineNumbers>
      {#each code.split('\n') as line, index (index)}
        <CodeBlockLine variant={highlighted.includes(index) ? 'highlighted' : 'default'}>{line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
