<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
  import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceDescription,
    TraceIcon,
    TraceLine,
    TraceTitle,
  } from '$registry/bases/base/ui/trace';

  let controlled = $state(false);
</script>

<div data-testid="lines">
  <Trace>
    <TraceLine><TraceTitle>Ran pnpm install</TraceTitle></TraceLine>
    <TraceLine status="error"><TraceTitle>Failed to run pnpm lint</TraceTitle></TraceLine>
    <TraceLine status="running"><TraceTitle>Running pnpm build</TraceTitle></TraceLine>
    <TraceLine status="pending"><TraceTitle>Run pnpm test</TraceTitle></TraceLine>
    <TraceLine><TraceTitle>Ran pnpm test</TraceTitle><TraceDescription>14s</TraceDescription></TraceLine>
  </Trace>
</div>

<div data-testid="link">
  <Trace>
    <a href="https://docs.astro.build/en/install-and-setup/" target="_blank" rel="noreferrer">
      <TraceLine>
        <TraceTitle>
          Install Astro
          <span class="sr-only"> (opens in a new tab)</span>
        </TraceTitle>
        <TraceIcon>→</TraceIcon>
      </TraceLine>
    </a>
  </Trace>
</div>

<div data-testid="closed">
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine><TraceTitle>Ran node --version</TraceTitle></TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>v24.18.0</TraceCollapsibleContent>
  </TraceCollapsible>
</div>

<div data-testid="starts-open">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine><TraceTitle>Ran npm --version</TraceTitle></TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>11.6.2</TraceCollapsibleContent>
  </TraceCollapsible>
</div>

<div data-testid="controlled">
  <TraceCollapsible bind:open={controlled}>
    <TraceCollapsibleTrigger>
      <TraceLine><TraceTitle>Ran pnpm --version</TraceTitle></TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>10.33.4</TraceCollapsibleContent>
  </TraceCollapsible>
  <button type="button" onclick={() => (controlled = !controlled)}>Toggle pnpm output</button>
  <output>{controlled ? 'open' : 'closed'}</output>
</div>

<div data-testid="kept">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine><TraceTitle>Kept turn</TraceTitle></TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent keepMounted>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine><TraceTitle>Kept step</TraceTitle></TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>kept output</TraceCollapsibleContent>
      </TraceCollapsible>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</div>

<div data-testid="dropped">
  <TraceCollapsible open>
    <TraceCollapsibleTrigger>
      <TraceLine><TraceTitle>Dropped turn</TraceTitle></TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine><TraceTitle>Dropped step</TraceTitle></TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>dropped output</TraceCollapsibleContent>
      </TraceCollapsible>
    </TraceCollapsibleContent>
  </TraceCollapsible>
</div>

<Trace>
  <Dialog>
    <DialogTrigger>
      <TraceLine><TraceTitle>Searched the web for cache keys</TraceTitle></TraceLine>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cache key results</DialogTitle>
        <DialogDescription>Three results were used.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</Trace>
