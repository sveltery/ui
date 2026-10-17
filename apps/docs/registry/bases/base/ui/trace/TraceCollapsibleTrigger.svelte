<script lang="ts">
  import type { TraceCollapsibleTriggerProps } from './types.js';
  import { cn } from 'cn';
  import { CollapsibleTrigger } from '../collapsible/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  import TraceIcon from './TraceIcon.svelte';
  let { children, class: classProp, ...props }: TraceCollapsibleTriggerProps = $props();
</script>
<CollapsibleTrigger
  data-slot="trace-collapsible-trigger"
  {...props}
  class={cn(
    'cn-trace-collapsible-trigger group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center text-left text-muted-foreground transition-colors outline-none hover:text-foreground has-[[data-status=error]]:text-destructive',
    classProp,
  )}
>
  {@render children?.()}
  <TraceIcon class="transition-transform group-aria-expanded/trace-collapsible-trigger:rotate-90">
    <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" />
  </TraceIcon>
</CollapsibleTrigger>
