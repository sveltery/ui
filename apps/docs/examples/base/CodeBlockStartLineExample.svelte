<script lang="ts">
  import { CodeBlock, CodeBlockContent, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';

  const code = `  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: { ownerId: session.user.id },
    orderBy: { updatedAt: "desc" },
  })

  return <ProjectList projects={projects} />
}`;

  const highlighted = useHighlightedCode(() => code, () => 'tsx');
</script>

<div class="w-full max-w-md">
  <CodeBlock>
    <CodeBlockHeader>
      <CodeBlockTitle>app/dashboard/page.tsx</CodeBlockTitle>
    </CodeBlockHeader>
    <CodeBlockContent lineNumbers startLine={995}>
      {#each highlighted.lines as line, index (index)}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
        <CodeBlockLine>{@html line}</CodeBlockLine>
      {/each}
    </CodeBlockContent>
  </CodeBlock>
</div>
