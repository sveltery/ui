<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';
  import type { UIMessage } from 'ai';

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

  function getMessageText(message: UIMessage) {
    return message.parts.reduce((text, part) => (part.type === 'text' ? text + part.text : text), '');
  }

  function groupParts(parts: UIMessage['parts']) {
    const runs: { trace: boolean; parts: UIMessage['parts'] }[] = [];

    for (const part of parts) {
      const trace = part.type === 'reasoning';

      if (!trace && part.type !== 'text') {
        continue;
      }

      const last = runs.at(-1);

      if (last?.trace === trace) {
        last.parts.push(part);
      } else {
        runs.push({ trace, parts: [part] });
      }
    }

    return runs;
  }
</script>

<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  const chat = new Chat({ messages: initialMessages, transport });
  const nextMessage = $derived(script.next(chat.messages));
  const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');
  // A click on a row wins over the streaming default. Rows are keyed by message and position.
  const userOpen = new SvelteMap<string, boolean>();

  function advance() {
    if (nextMessage) {
      chat.sendMessage(nextMessage);
    } else {
      userOpen.clear();
      chat.messages = initialMessages;
    }
  }
</script>

{#snippet thinkingLine(running: boolean)}
  <TraceLine status={running ? 'running' : undefined}>
    <TraceIcon>
      <IconPlaceholder lucide="BrainIcon" tabler="IconBrain" hugeicons="AiBrainIcon" phosphor="BrainIcon" remixicon="RiBrainLine" />
    </TraceIcon>
    <TraceTitle>{running ? 'Thinking' : 'Thought'}</TraceTitle>
  </TraceLine>
{/snippet}

{#snippet thinking(key: string, text: string, running: boolean)}
  {#if text.length === 0}
    {@render thinkingLine(running)}
  {:else}
    <TraceCollapsible bind:open={() => userOpen.get(key) ?? running, (next) => userOpen.set(key, next)}>
      <TraceCollapsibleTrigger>{@render thinkingLine(running)}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent class="whitespace-pre-wrap">{text}</TraceCollapsibleContent>
    </TraceCollapsible>
  {/if}
{/snippet}

<div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
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
      {const live = $derived(chat.status === 'streaming' && message === chat.messages.at(-1))}
      <Message>
        <MessageContent class="gap-4">
          {#each groupParts(message.parts) as run, runIndex (runIndex)}
            {#if run.trace}
              <Trace>
                {#each run.parts as part, index (index)}
                  {#if part.type === 'reasoning'}
                    {@render thinking(`${message.id}-${runIndex}-${index}`, part.text, live && part.state === 'streaming')}
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
