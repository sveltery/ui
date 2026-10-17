<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';
  import type { UIDataTypes, UIMessage } from 'ai';

  type ChatMessage = UIMessage<
    unknown,
    UIDataTypes,
    {
      runCommand: {
        input: { command: string };
        output: { stdout: string };
      };
    }
  >;

  type Part = ChatMessage['parts'][number];

  const script = createChat<ChatMessage>()
    .user('Why does pnpm install fail in CI?')
    .assistant(({ writer }) => {
      writer.reasoning(
        'CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree. I should check what the last commit changed, then reproduce the install.',
        { delayMs: 40 },
      );
      writer.tool('runCommand', { input: { command: 'pnpm --version' } }).sleep(700).output({ stdout: '10.18.0' });
      writer
        .tool('runCommand', { input: { command: 'git diff --stat HEAD~1 -- package.json pnpm-lock.yaml' } })
        .sleep(900)
        .output({ stdout: ' package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)' });
      writer
        .tool('runCommand', { input: { command: 'pnpm install --frozen-lockfile' } })
        .sleep(1200)
        .error('ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json');
      writer.sourceUrl({ url: 'https://pnpm.io/cli/install#--frozen-lockfile', title: 'pnpm install | pnpm.io' });
      writer.sourceUrl({ url: 'https://pnpm.io/continuous-integration', title: 'Continuous Integration | pnpm.io' });
      writer.sleep(1000);
      writer.text('The last commit bumped a version in package.json without updating pnpm-lock.yaml, so the frozen install fails. Run pnpm install locally and commit the lockfile.');
    });

  const transcript = script.get();
  const [question] = script.get(1);
  const transport = script.transport({ delayMs: 20 });

  function getMessageText(message: ChatMessage) {
    return message.parts.reduce((text, part) => (part.type === 'text' ? text + part.text : text), '');
  }
</script>

<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { SvelteMap } from 'svelte/reactivity';
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

  const chat = new Chat<ChatMessage>({ messages: transcript, transport });
  const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');
  // A click on a thinking row wins over the streaming default. Rows are keyed by message and position.
  const userOpen = new SvelteMap<string, boolean>();

  function replay() {
    userOpen.clear();
    chat.messages = [];
    chat.sendMessage(question);
  }
</script>

{#snippet thinking(key: string, text: string, running: boolean)}
  {#snippet line()}
    <TraceLine status={running ? 'running' : undefined}>
      <TraceIcon>
        {#if running}
          <IconPlaceholder lucide="LoaderCircleIcon" tabler="IconLoader2" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" class="animate-spin" />
        {:else}
          <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" />
        {/if}
      </TraceIcon>
      <TraceTitle>{running ? 'Thinking' : 'Thought for 5s'}</TraceTitle>
    </TraceLine>
  {/snippet}

  {#if text.length === 0}
    {@render line()}
  {:else}
    <TraceCollapsible bind:open={() => userOpen.get(key) ?? running, (next) => userOpen.set(key, next)}>
      <TraceCollapsibleTrigger>{@render line()}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent class="whitespace-pre-wrap">{text}</TraceCollapsibleContent>
    </TraceCollapsible>
  {/if}
{/snippet}

{#snippet tool(part: Extract<Part, { type: 'tool-runCommand' }>, streaming: boolean, open?: boolean)}
  {const command = $derived(part.input?.command)}
  {#if part.state === 'output-available' || part.state === 'output-error'}
    {const failed = $derived(part.state === 'output-error')}
    <TraceCollapsible {open}>
      <TraceCollapsibleTrigger>
        <TraceLine status={failed ? 'error' : undefined}>
          <TraceIcon>
            {#if failed}
              <IconPlaceholder lucide="CircleAlertIcon" tabler="IconExclamationCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" />
            {:else}
              <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" />
            {/if}
          </TraceIcon>
          <TraceTitle>{failed ? 'Failed to run' : 'Ran'} {command}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        {#if part.state === 'output-error'}
          <CodeBlock size="sm" variant="destructive">
            <CodeBlockContent wrap class="max-h-64" code={part.errorText} />
          </CodeBlock>
        {:else}
          <CodeBlock size="sm">
            <CodeBlockContent wrap class="max-h-64" code={part.output.stdout} />
          </CodeBlock>
        {/if}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  {:else}
    <TraceLine status={streaming ? 'running' : 'error'}>
      <TraceIcon>
        {#if streaming}
          <IconPlaceholder lucide="LoaderCircleIcon" tabler="IconLoader2" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" class="animate-spin" />
        {:else}
          <IconPlaceholder lucide="CircleAlertIcon" tabler="IconExclamationCircle" hugeicons="AlertCircleIcon" phosphor="WarningCircleIcon" remixicon="RiErrorWarningLine" />
        {/if}
      </TraceIcon>
      <TraceTitle>{streaming ? 'Running' : 'Failed to run'} {command}</TraceTitle>
    </TraceLine>
  {/if}
{/snippet}

{#snippet sourcesRow(sources: Extract<Part, { type: 'source-url' }>[], running: boolean)}
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status={running ? 'running' : undefined}>
        <TraceIcon>
          {#if running}
            <IconPlaceholder lucide="LoaderCircleIcon" tabler="IconLoader2" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" class="animate-spin" />
          {:else}
            <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
          {/if}
        </TraceIcon>
        <TraceTitle>{running ? 'Using' : 'Used'} {sources.length} sources</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        {#each sources as source (source.url)}
          <a href={source.url} target="_blank" rel="noreferrer">
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
              </TraceIcon>
              <TraceTitle>
                {source.title ?? new URL(source.url).hostname}
                <span class="sr-only"> (opens in a new tab)</span>
              </TraceTitle>
              <TraceIcon>
                <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" />
              </TraceIcon>
            </TraceLine>
          </a>
        {/each}
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
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
      {const streaming = $derived(busy && message === chat.messages.at(-1))}
      {const rows = $derived(message.parts.filter((part) => part.type === 'reasoning' || part.type === 'tool-runCommand'))}
      {const sources = $derived(message.parts.filter((part) => part.type === 'source-url'))}
      {const text = $derived(getMessageText(message))}
      <Message>
        <MessageContent class="gap-4">
          {#if rows.length + sources.length > 0}
            <Trace>
              {#each rows as part, index (part.type === 'tool-runCommand' ? part.toolCallId : index)}
                {#if part.type === 'reasoning'}
                  {@render thinking(`${message.id}-${index}`, part.text, streaming && part.state === 'streaming')}
                {:else if part.type === 'tool-runCommand'}
                  {@render tool(part, streaming, index === 2 ? true : undefined)}
                {/if}
              {/each}
              {#if sources.length > 0}
                {@render sourcesRow(sources, streaming && text.length === 0)}
              {/if}
            </Trace>
          {/if}
          {#if text}
            <p>{text}</p>
          {/if}
        </MessageContent>
      </Message>
    {/if}
  {/each}
  {#if !busy}
    <Button variant="outline" size="sm" class="mt-auto self-start" onclick={replay}>Replay</Button>
  {/if}
</div>
