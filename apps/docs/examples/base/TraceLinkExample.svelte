<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Trace, TraceIcon, TraceLine, TraceTitle } from '$registry/bases/base/ui/trace';
</script>

<Trace class="max-w-sm">
  <a href="#link">
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
  <a href="https://docs.astro.build/en/install-and-setup/" target="_blank" rel="noreferrer">
    <TraceLine>
      <TraceIcon>
        <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
      </TraceIcon>
      <TraceTitle>
        Install Astro | docs.astro.build
        <span class="sr-only"> (opens in a new tab)</span>
      </TraceTitle>
      <TraceIcon>
        <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" />
      </TraceIcon>
    </TraceLine>
  </a>
</Trace>
