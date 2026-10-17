<script lang="ts">
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  const output = `$ node --version
v24.18.0`;

  const error = `$ pnpm dev
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1908:16)`;
</script>

<div class="w-full max-w-md">
  <Trace>
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
          <CodeBlockContent wrap class="max-h-64" code={output} />
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
    <TraceCollapsible open>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceIcon>
            <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
          </TraceIcon>
          <TraceTitle>Failed to run pnpm dev</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm" variant="destructive">
          <CodeBlockContent wrap class="max-h-64" code={error} />
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  </Trace>
</div>
