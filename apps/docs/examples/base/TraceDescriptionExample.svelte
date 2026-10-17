<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Trace,
    TraceDescription,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';
</script>

<Trace class="max-w-sm">
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="FilePenIcon" tabler="IconFilePencil" hugeicons="FileEditIcon" phosphor="NotePencilIcon" remixicon="RiFileEditLine" />
    </TraceIcon>
    <TraceTitle>Edited components/settings/notification-preferences-form.tsx</TraceTitle>
    <TraceDescription class="font-mono">+48 −12</TraceDescription>
  </TraceLine>
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
    </TraceIcon>
    <TraceTitle>Ran pnpm test</TraceTitle>
    <TraceDescription>14s</TraceDescription>
  </TraceLine>
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
    </TraceIcon>
    <TraceTitle>Searched for useChat</TraceTitle>
    <TraceDescription>8 results</TraceDescription>
  </TraceLine>
</Trace>
