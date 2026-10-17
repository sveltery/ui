<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';
  import type { UIMessage } from 'ai';

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

  function getMessageText(message: UIMessage) {
    return message.parts.reduce((text, part) => (part.type === 'text' ? text + part.text : text), '');
  }

  function groupParts(parts: UIMessage['parts']) {
    const runs: { trace: boolean; parts: UIMessage['parts'] }[] = [];

    for (const part of parts) {
      const trace = part.type === 'dynamic-tool';

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
  import type { DynamicToolUIPart } from 'ai';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';
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

  function advance() {
    if (nextMessage) {
      chat.sendMessage(nextMessage);
    } else {
      chat.messages = initialMessages;
    }
  }
</script>

{#snippet terminalIcon()}
  <TraceIcon>
    <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
  </TraceIcon>
{/snippet}

{#snippet tool(part: DynamicToolUIPart, live: boolean)}
  {const command = $derived((part.input as { command?: string } | undefined)?.command)}
  {#if part.state === 'output-available' || part.state === 'output-error'}
    {const failed = $derived(part.state === 'output-error')}
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine status={failed ? 'error' : undefined}>
          {@render terminalIcon()}
          <TraceTitle>{failed ? 'Failed to run' : 'Ran'} {command}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap class="max-h-64" code={part.state === 'output-error' ? part.errorText : (part.output as { stdout: string }).stdout} />
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  {:else if part.state === 'output-denied'}
    <TraceLine>
      {@render terminalIcon()}
      <TraceTitle>Denied {command}</TraceTitle>
    </TraceLine>
  {:else}
    <TraceLine status={live ? 'running' : 'error'}>
      {@render terminalIcon()}
      <TraceTitle>{live ? 'Running' : 'Failed to run'} {command}</TraceTitle>
    </TraceLine>
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
                  {#if part.type === 'dynamic-tool'}
                    {@render tool(part, live)}
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
