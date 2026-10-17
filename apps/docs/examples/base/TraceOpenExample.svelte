<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
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

  const nodeOutput = `$ node --version
v24.18.0`;
  const pnpmOutput = `$ pnpm --version
10.33.4`;

  let open = $state(false);
</script>

<div class="flex w-full max-w-sm flex-col items-start gap-4">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        </TraceIcon>
        <TraceTitle>Ran node --version</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <CodeBlock size="sm">
        <CodeBlockContent wrap class="max-h-64" code={nodeOutput} />
      </CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
  <TraceCollapsible bind:open>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
        </TraceIcon>
        <TraceTitle>Ran pnpm --version</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <CodeBlock size="sm">
        <CodeBlockContent wrap class="max-h-64" code={pnpmOutput} />
      </CodeBlock>
    </TraceCollapsibleContent>
  </TraceCollapsible>
  <Button variant="outline" size="sm" onclick={() => (open = !open)}>
    {open ? 'Hide' : 'Show'} the pnpm output
  </Button>
</div>
