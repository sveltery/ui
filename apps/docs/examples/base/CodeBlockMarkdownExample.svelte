<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';
  import type { UIMessage } from 'ai';

  const response = `Wrap the value in a \`useDebounce\` hook. It returns the latest value once it stops changing for \`delay\` milliseconds.

\`\`\`tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
\`\`\`

Pass the debounced value to your fetch instead of the raw input.`;

  const script = createChat()
    .user('How do I debounce a search input in React?')
    .assistant(({ writer }) => {
      writer.text(response);
    });

  const transcript = script.get();
  const [question] = script.get(1);
  const transport = script.transport({ delayMs: 30 });

  function getMessageText(message: UIMessage) {
    return message.parts.reduce((text, part) => (part.type === 'text' ? text + part.text : text), '');
  }
</script>

<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { Streamdown } from 'svelte-streamdown';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import MarkdownCodeBlock from './code-block/MarkdownCodeBlock.svelte';

  const chat = new Chat({ messages: transcript, transport });
  const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');

  function replay() {
    chat.messages = [];
    chat.sendMessage(question!);
  }
</script>

<div class="flex min-h-112 w-full max-w-md flex-col gap-4 py-6 text-sm">
  {#each chat.messages as message (message.id)}
    {#if message.role === 'user'}
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>{getMessageText(message)}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    {:else}
      <Message>
        <MessageContent>
          <!-- The class is the root class Streamdown's React version sets. -->
          <Streamdown class="space-y-4 whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0" content={getMessageText(message)} controls={false} static={!(busy && message === chat.messages.at(-1))}>
            {#snippet code({ token, incomplete })}
              <MarkdownCodeBlock code={token.text} language={token.lang ?? ''} {incomplete} />
            {/snippet}
            {#snippet codespan({ children })}
              <code class="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]">{@render children()}</code>
            {/snippet}
          </Streamdown>
        </MessageContent>
      </Message>
    {/if}
  {/each}
  {#if !busy}
    <Button variant="outline" size="sm" class="mt-auto self-start" onclick={replay}>Replay</Button>
  {/if}
</div>
