<script module lang="ts">
  import { createChat } from '@shadcn/helpers/ai-sdk';
  import type { ChatMessage } from './trace/demo-types.js';

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
</script>

<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import { Trace } from '$registry/bases/base/ui/trace';
  import DemoSourcesRow from './trace/DemoSourcesRow.svelte';
  import DemoThinkingRow from './trace/DemoThinkingRow.svelte';
  import DemoToolRow from './trace/DemoToolRow.svelte';
  import { getMessageText } from './trace/message-text.js';
  import UserMessage from './trace/UserMessage.svelte';

  const chat = new Chat<ChatMessage>({ messages: transcript, transport });
  const busy = $derived(chat.status === 'submitted' || chat.status === 'streaming');

  function replay() {
    chat.messages = [];
    chat.sendMessage(question);
  }
</script>

<div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
  {#each chat.messages as message (message.id)}
    {#if message.role === 'user'}
      <UserMessage {message} />
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
                  <DemoThinkingRow text={part.text} running={streaming && part.state === 'streaming'} />
                {:else if part.type === 'tool-runCommand'}
                  <DemoToolRow {part} {streaming} open={index === 2 ? true : undefined} />
                {/if}
              {/each}
              {#if sources.length > 0}
                <DemoSourcesRow {sources} running={streaming && text.length === 0} />
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
