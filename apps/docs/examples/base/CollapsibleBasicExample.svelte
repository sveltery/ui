<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent } from '$registry/bases/base/ui/card';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
</script>

{#snippet trigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="ghost" class="w-full">
    {@render children?.()}
  </Button>
{/snippet}

<Card class="mx-auto w-full max-w-sm">
  <CardContent>
    <Collapsible class="rounded-md data-open:bg-muted">
      <CollapsibleTrigger render={trigger}>
        Product details
        <ChevronDownIcon class="ml-auto group-data-panel-open/button:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
        <div>This panel can be expanded or collapsed to reveal additional content.</div>
        <Button size="xs">Learn More</Button>
      </CollapsibleContent>
    </Collapsible>
  </CardContent>
</Card>
