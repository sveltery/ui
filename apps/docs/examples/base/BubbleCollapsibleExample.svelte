<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Collapsible, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';

  const text = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

  const previewLength = 180;

  let open = $state(false);
  const isLong = text.length > previewLength;
  const preview = `${text.slice(0, previewLength)}...`;
</script>

<div class="flex w-full max-w-sm flex-col gap-8 py-12">
  <Bubble variant="muted">
    <BubbleContent>How can I help you today?</BubbleContent>
  </Bubble>

  <Bubble variant="muted" align="end">
    <BubbleContent class="whitespace-pre-line">
      <Collapsible bind:open>
        <div>{open || !isLong ? text : preview}</div>
        {#if isLong}
          <CollapsibleTrigger>
            {#snippet render(props, _state, content)}
              <Button variant="link" class="gap-1 p-0 text-muted-foreground" {...props}>{@render content?.()}</Button>
            {/snippet}
            {open ? 'Show less' : 'Show more'}
            <ChevronDownIcon data-icon="inline-end" class="group-data-panel-open/button:rotate-180" />
          </CollapsibleTrigger>
        {/if}
      </Collapsible>
    </BubbleContent>
  </Bubble>
</div>
