<script lang="ts">
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
  import type { Part } from './demo-types.js';

  let { sources, running }: { sources: Extract<Part, { type: 'source-url' }>[]; running: boolean } = $props();
</script>

<TraceCollapsible>
  <TraceCollapsibleTrigger>
    <TraceLine status={running ? 'running' : undefined}>
      <TraceIcon>
        {#if running}
          <IconPlaceholder lucide="LoaderCircleIcon" tabler="IconLoader2" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" class="animate-spin" />
        {:else}
          <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
        {/if}
      </TraceIcon>
      <TraceTitle>{running ? 'Using' : 'Used'} {sources.length} sources</TraceTitle>
    </TraceLine>
  </TraceCollapsibleTrigger>
  <TraceCollapsibleContent>
    <Trace>
      {#each sources as source (source.url)}
        <a href={source.url} target="_blank" rel="noreferrer">
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
            </TraceIcon>
            <TraceTitle>
              {source.title ?? new URL(source.url).hostname}
              <span class="sr-only"> (opens in a new tab)</span>
            </TraceTitle>
            <TraceIcon>
              <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" />
            </TraceIcon>
          </TraceLine>
        </a>
      {/each}
    </Trace>
  </TraceCollapsibleContent>
</TraceCollapsible>
