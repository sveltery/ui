<script lang="ts">
  import { CodeBlock, CodeBlockContent } from '$registry/bases/base/ui/code-block';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceDescription,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';
</script>

<div class="w-full max-w-sm">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine status="error">
        <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted class="flex flex-col gap-2">
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder lucide="BrainIcon" tabler="IconBrain" hugeicons="AiBrainIcon" phosphor="BrainIcon" remixicon="RiBrainLine" />
              </TraceIcon>
              <TraceTitle>Thought</TraceTitle>
              <TraceDescription>12s</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent class="whitespace-pre-wrap">
            I should check which package managers are installed before I scaffold anything.
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible open>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
              </TraceIcon>
              <TraceTitle>Ran 2 commands, 1 failed</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent keepMounted>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
                </TraceIcon>
                <TraceTitle>Ran node --version</TraceTitle>
              </TraceLine>
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  <TraceLine status="error">
                    <TraceIcon>
                      <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
                    </TraceIcon>
                    <TraceTitle>Failed to run pnpm --version</TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <CodeBlock size="sm" variant="destructive">
                    <CodeBlockContent wrap class="max-h-64" code="command not found: pnpm" />
                  </CodeBlock>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <p>Node is installed and pnpm is not. Reading the docs config.</p>
      <Trace>
        <a href="#whole-turn">
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder lucide="FileTextIcon" tabler="IconFileDescription" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
            </TraceIcon>
            <TraceTitle>Read apps/v4/lib/docs.ts</TraceTitle>
            <TraceIcon>
              <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
            </TraceIcon>
          </TraceLine>
        </a>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</div>
