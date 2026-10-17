<script lang="ts">
  import { CodeBlock, CodeBlockHeader, CodeBlockTitle } from '$registry/bases/base/ui/code-block';
  import Sample from './code-block/Sample.svelte';

  const samples = [
    {
      language: 'css',
      title: 'app/globals.css',
      code: `@import "tailwindcss";

:root {
  --radius: 0.625rem;
}`,
    },
    {
      language: 'python',
      title: 'main.py',
      code: `def greet(name: str) -> str:
    return f"Hello, {name}!"`,
    },
    {
      language: 'text',
      title: 'notes.txt',
      code: 'A language that is not in the list renders as plain text.',
    },
  ];
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  {#each samples as sample (sample.language)}
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{sample.title}</CodeBlockTitle>
      </CodeBlockHeader>
      <Sample code={sample.code} language={sample.language} />
    </CodeBlock>
  {/each}
</div>
