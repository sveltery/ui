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

  const sources = [
    { title: 'Install Astro | docs.astro.build', href: 'https://docs.astro.build/en/install-and-setup/' },
    { title: 'create-astro | npmjs.com', href: 'https://www.npmjs.com/package/create-astro' },
    { title: 'Settings: minimumReleaseAge | pnpm.io', href: 'https://pnpm.io/settings#minimumreleaseage' },
  ];
</script>

<div class="w-full max-w-sm">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon>
          <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
        </TraceIcon>
        <TraceTitle>Used {sources.length} sources</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <Trace>
        {#each sources as source (source.href)}
          <a href={source.href} target="_blank" rel="noreferrer">
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder lucide="GlobeIcon" tabler="IconWorld" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobalLine" />
              </TraceIcon>
              <TraceTitle>
                {source.title}
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
</div>
