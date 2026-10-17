<script lang="ts">
  import type { DynamicToolUIPart } from 'ai';
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  let { part, live }: { part: DynamicToolUIPart; live: boolean } = $props();

  const command = $derived((part.input as { command?: string } | undefined)?.command);
</script>

{#if part.state === 'output-available' || part.state === 'output-error'}
  {const failed = $derived(part.state === 'output-error')}
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine status={failed ? 'error' : undefined}>
        <TraceIcon>
          <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        </TraceIcon>
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
    <TraceIcon>
      <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
    </TraceIcon>
    <TraceTitle>Denied {command}</TraceTitle>
  </TraceLine>
{:else}
  <TraceLine status={live ? 'running' : 'error'}>
    <TraceIcon>
      <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
    </TraceIcon>
    <TraceTitle>{live ? 'Running' : 'Failed to run'} {command}</TraceTitle>
  </TraceLine>
{/if}
