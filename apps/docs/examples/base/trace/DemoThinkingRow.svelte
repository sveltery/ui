<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  let { text, running }: { text: string; running: boolean } = $props();

  // The reader's click wins over the streaming default until the next stream starts.
  let userOpen = $state<boolean>();
</script>

{#snippet line()}
  <TraceLine status={running ? 'running' : undefined}>
    <TraceIcon>
      {#if running}
        <IconPlaceholder lucide="LoaderCircleIcon" tabler="IconLoader2" hugeicons="Loading03Icon" phosphor="SpinnerIcon" remixicon="RiLoader4Line" class="animate-spin" />
      {:else}
        <IconPlaceholder lucide="CircleCheckIcon" tabler="IconCircleCheck" hugeicons="CheckmarkCircle02Icon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" />
      {/if}
    </TraceIcon>
    <TraceTitle>{running ? 'Thinking' : 'Thought for 5s'}</TraceTitle>
  </TraceLine>
{/snippet}

{#if text.length === 0}
  {@render line()}
{:else}
  <TraceCollapsible bind:open={() => userOpen ?? running, (next) => (userOpen = next)}>
    <TraceCollapsibleTrigger>{@render line()}</TraceCollapsibleTrigger>
    <TraceCollapsibleContent class="whitespace-pre-wrap">{text}</TraceCollapsibleContent>
  </TraceCollapsible>
{/if}
