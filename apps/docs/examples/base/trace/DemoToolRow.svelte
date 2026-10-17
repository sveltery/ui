<script lang="ts">
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
  import type { Part } from './demo-types.js';

  let { part, streaming, open }: { part: Extract<Part, { type: 'tool-runCommand' }>; streaming: boolean; open?: boolean } = $props();

  const command = $derived(part.input?.command);
  const failed = $derived(part.state === 'output-error');
</script>

{#if part.state === 'output-available' || part.state === 'output-error'}
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
