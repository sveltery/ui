<script lang="ts">
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sveltery/components/hover-card';
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@sveltery/components/tooltip';
</script>
<div class="flex gap-8 p-16">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipContent>Save changes</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger>Share</TooltipTrigger>
      <TooltipContent side="bottom">Share with your team</TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <HoverCard>
    <HoverCardTrigger href="#profile" delay={100} closeDelay={100}>@sveltery</HoverCardTrigger>
    <HoverCardContent>
      <p>Svelte components on Base UI behavior.</p>
      <a href="#repo">Repository</a>
    </HoverCardContent>
  </HoverCard>
  <button type="button">Elsewhere</button>
</div>
