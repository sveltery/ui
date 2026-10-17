<script lang="ts">
  import { Badge } from '$registry/bases/base/ui/badge';
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
</script>

<div class="w-full max-w-sm">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine status="running">
        <TraceTitle>Looking into the slow deploy</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
              </TraceIcon>
              <TraceTitle>Searched for the checkout build log</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent class="flex flex-wrap gap-1.5">
            <Badge variant="secondary">vercel.com</Badge>
            <Badge variant="secondary">github.com</Badge>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <a href="#chain-of-thought">
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder lucide="FileTextIcon" tabler="IconFileDescription" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
            </TraceIcon>
            <TraceTitle>Read the last twelve deploys</TraceTitle>
            <TraceIcon>
              <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
            </TraceIcon>
          </TraceLine>
        </a>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="running">
              <TraceIcon>
                <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
              </TraceIcon>
              <TraceTitle>Searching for the cache key</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap class="max-h-64" code="cache key image optimization" />
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</div>
