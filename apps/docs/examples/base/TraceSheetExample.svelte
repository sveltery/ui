<script lang="ts">
  import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '$registry/bases/base/ui/sheet';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Trace, TraceIcon, TraceLine, TraceTitle } from '$registry/bases/base/ui/trace';
</script>

<Trace class="max-w-sm">
  <Sheet>
    <SheetTrigger>
      <TraceLine>
        <TraceIcon>
          <IconPlaceholder lucide="FolderSearchIcon" tabler="IconFolderSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
        </TraceIcon>
        <TraceTitle>Explored 4 files</TraceTitle>
        <TraceIcon>
          <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
        </TraceIcon>
      </TraceLine>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Explored 4 files</SheetTitle>
        <SheetDescription>Files read while preparing the response.</SheetDescription>
      </SheetHeader>
      <ul class="flex flex-col gap-2 px-6 font-mono text-xs">
        <li>apps/v4/lib/docs.ts</li>
        <li>apps/v4/lib/components.ts</li>
        <li>apps/v4/next.config.mjs</li>
        <li>apps/v4/package.json</li>
      </ul>
    </SheetContent>
  </Sheet>
</Trace>
