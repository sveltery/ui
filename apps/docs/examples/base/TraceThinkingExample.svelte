<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';

  const script = createChat()
    .user('Why is the checkout deploy so slow?')
    .assistant(({ writer }) => {
      writer.reasoning(
        'The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.',
        { delayMs: 60 },
      );
      writer.sleep(400);
      writer.text('Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash.');
    });

  const initialMessages = script.get(0);
  const transport = script.transport({ delayMs: 20 });
</script>

<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import { Trace } from '$registry/bases/base/ui/trace';
  import { groupParts } from './trace/group-parts.js';
  import ThinkingTrace from './trace/ThinkingTrace.svelte';
  import UserMessage from './trace/UserMessage.svelte';

  const chat = new Chat({ messages: initialMessages, transport });
  const nextMessage = $derived(script.next(chat.messages));
  const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');

  function advance() {
    if (nextMessage) {
      chat.sendMessage(nextMessage);
    } else {
      chat.messages = initialMessages;
    }
  }
</script>

<div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
  {#each chat.messages as message (message.id)}
    {#if message.role === 'user'}
      <UserMessage {message} />
    {:else}
      {const live = $derived(chat.status === 'streaming' && message === chat.messages.at(-1))}
      <Message>
        <MessageContent class="gap-4">
          {#each groupParts(message.parts, (part) => part.type === 'reasoning') as run, runIndex (runIndex)}
            {#if run.trace}
              <Trace>
                {#each run.parts as part, index (index)}
                  {#if part.type === 'reasoning'}
                    <ThinkingTrace text={part.text} running={live && part.state === 'streaming'} />
                  {/if}
                {/each}
              </Trace>
            {:else}
              {#each run.parts as part, index (index)}
                {#if part.type === 'text'}
                  <p>{part.text}</p>
                {/if}
              {/each}
            {/if}
          {/each}
        </MessageContent>
      </Message>
    {/if}
  {/each}
  {#if !busy}
    <Button variant="outline" size="sm" class="mt-auto self-start" onclick={advance}>
      {nextMessage ? 'Send message' : 'Reset'}
    </Button>
  {/if}
</div>
