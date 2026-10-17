<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Trace, TraceIcon, TraceLine, TraceTitle } from '$registry/bases/base/ui/trace';
</script>

<Trace class="max-w-sm">
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
    </TraceIcon>
    <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
  </TraceLine>
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="FileTextIcon" tabler="IconFileDescription" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
    </TraceIcon>
    <TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
  </TraceLine>
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
    </TraceIcon>
    <TraceTitle>Ran pnpm install</TraceTitle>
  </TraceLine>
</Trace>
