<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import StreamingBlock from './code-block/StreamingBlock.svelte';

  const blocks: ComponentProps<typeof StreamingBlock>['block'][] = [
    {
      title: 'hooks/use-debounce.ts',
      language: 'ts',
      lineNumbers: true,
      code: `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}`,
    },
    {
      language: 'bash',
      code: 'pnpm dlx shadcn@latest add code-block',
    },
    {
      title: 'components/search.tsx',
      language: 'tsx',
      lineNumbers: true,
      diff: true,
      code: ` export function Search() {
   const [query, setQuery] = React.useState("")
-  const results = useSearch(query)
+  const debounced = useDebounce(query, 300)
+  const results = useSearch(debounced)

   return <SearchResults results={results} />
 }`,
    },
    {
      title: 'app/api/chat/route.ts',
      language: 'ts',
      lineNumbers: true,
      highlight: [5, 6, 7, 8],
      code: `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`,
    },
    {
      title: '.env.local',
      language: 'bash',
      code: 'AI_GATEWAY_API_KEY=your-api-key',
    },
  ];

  // Where each block starts in the stream.
  const offsets = blocks.map((_, index) => blocks.slice(0, index).reduce((total, block) => total + block.code.length, 0));
  const total = blocks.reduce((sum, block) => sum + block.code.length, 0);

  let length = $state(total);

  $effect(() => {
    if (length >= total) {
      return;
    }

    const timeout = setTimeout(() => (length += 3), 16);
    return () => clearTimeout(timeout);
  });
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  {#each blocks as block, index (block.code)}
    {#if length > offsets[index]}
      <StreamingBlock {block} code={block.code.slice(0, length - offsets[index])} />
    {/if}
  {/each}
  <Button variant="outline" size="sm" class="self-start" disabled={length < total} onclick={() => (length = 0)}>
    <IconPlaceholder lucide="RotateCcwIcon" tabler="IconRotate" hugeicons="RotateLeftIcon" phosphor="ArrowCounterClockwiseIcon" remixicon="RiAnticlockwiseLine" />
    Replay
  </Button>
</div>
