<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';

  const script = createChat()
    .user('Which package managers are installed?')
    .assistant(({ writer }) => {
      writer.tool('runCommand', { dynamic: true, input: { command: 'node --version' } }).sleep(900).output({ stdout: 'v24.18.0' });
      writer.tool('runCommand', { dynamic: true, input: { command: 'npm --version' } }).sleep(900).output({ stdout: '11.6.2' });
      writer.tool('runCommand', { dynamic: true, input: { command: 'pnpm --version' } }).sleep(900).error('command not found: pnpm');
      writer.text('Node 24 and npm 11 are installed. pnpm is not.');
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
  import ToolTrace from './trace/ToolTrace.svelte';
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
          {#each groupParts(message.parts, (part) => part.type === 'dynamic-tool') as run, runIndex (runIndex)}
            {#if run.trace}
              <Trace>
                {#each run.parts as part (part.type === 'dynamic-tool' ? part.toolCallId : part)}
                  {#if part.type === 'dynamic-tool'}
                    <ToolTrace {part} {live} />
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
