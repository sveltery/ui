<script lang="ts">
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';

  const output = `Error: The model "anthropic/claude-sonnet-4.5" returned an error: Request too large. The prompt is 212,431 tokens and the context window is 200,000 tokens. Remove some messages or summarize the conversation and try again.`;
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  <CodeBlock>
    <CodeBlockContent code={output} />
  </CodeBlock>
  <CodeBlock>
    <CodeBlockContent wrap code={output} />
  </CodeBlock>
</div>
