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

  const output = `$ node --version
v24.18.0`;
</script>

<div class="w-full max-w-sm">
  <TraceCollapsible>
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
</div>
