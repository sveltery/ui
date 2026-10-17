<script lang="ts">
  import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';

  const code = `{
  "location": "San Francisco",
  "temperature": 18,
  "unit": "celsius",
  "conditions": ["fog", "wind"]
}`;

  const highlighted = useHighlightedCode(() => code, () => 'json');
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>getWeather output</CodeBlockTitle>
    </CodeBlockHeader>
    <CodeBlockContent>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
