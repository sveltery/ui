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
      <IconPlaceholder lucide="BrainIcon" tabler="IconBrain" hugeicons="AiBrainIcon" phosphor="BrainIcon" remixicon="RiBrainLine" />
    </TraceIcon>
    <TraceTitle>{running ? 'Thinking' : 'Thought'}</TraceTitle>
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
