<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Bubble, BubbleContent, BubbleGroup } from '@sveltery/ui/bubble';
</script>

{#snippet BubbleSizes()}
  <Example title="Sizes">
    <div class="flex w-full max-w-md flex-col gap-8">
      <Bubble>
        <BubbleContent>This is a one line bubble.</BubbleContent>
      </Bubble>
      <Bubble>
        <BubbleContent>
          This bubble has multiple lines. It should wrap to the next line and
          you should see a different radius on the corners.
        </BubbleContent>
      </Bubble>
      <Bubble>
        <BubbleContent>
          <p>This bubble has multiple lines.</p>
          <p>
            It should wrap to the next line and you should see a different
            radius on the corners.
          </p>
          <p>Here is some more text to see how it wraps.</p>
        </BubbleContent>
      </Bubble>
    </div>
  </Example>

{/snippet}

{#snippet BubbleVariants()}
  <Example title="Variants">
    <div class="flex w-full max-w-md flex-col gap-8">
      <Bubble>
        <BubbleContent>
          Default bubbles use the primary color for the active user side of a
          chat.
        </BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>
          Secondary bubbles are the standard neutral surface for assistant and
          conversation content.
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          Muted bubbles lower the emphasis for quiet system notes or for
          displaying supporting content.
        </BubbleContent>
      </Bubble>
      <Bubble variant="tinted" align="end">
        <BubbleContent>
          Tinted bubbles use a softer primary tint when primary fill is too
          strong.
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline">
        <BubbleContent>
          Outline bubbles can be used to frame message content and give it a
          border.
        </BubbleContent>
      </Bubble>
      <Bubble variant="destructive">
        <BubbleContent>
          Destructive bubbles flag errors or failed actions in a conversation.
        </BubbleContent>
      </Bubble>
      <Bubble variant="ghost">
        <BubbleContent>
          <span class="whitespace-pre-wrap">
            {`Ghost bubbles work for assistant text and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container.

Ghost bubbles are full width and can take the full width of the container.
`}
          </span>
        </BubbleContent>
      </Bubble>
    </div>
  </Example>

{/snippet}

{#snippet BubbleAlignment()}
  <Example title="Alignment">
    <div class="flex w-full max-w-md flex-col gap-8">
      <Bubble variant="muted">
        <BubbleContent>This bubble is aligned to the start.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>This bubble is aligned to the end.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          This multiline bubble is aligned to the start. The corners should
          adjust when the text wraps to show the grouped side of the
          conversation.
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>
          This multiline bubble is aligned to the end. It should sit on the
          opposite side with the matching corner radius for wrapped text.
        </BubbleContent>
      </Bubble>
    </div>
  </Example>

{/snippet}

{#snippet BubbleGrouped()}
  <Example title="Grouped">
    <div class="flex w-full max-w-md flex-col gap-8">
      <BubbleGroup>
        <Bubble variant="secondary">
          <BubbleContent>I finished the audit pass.</BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>
            The registry output looks clean, but I found one stale route.
          </BubbleContent>
        </Bubble>
        <Bubble variant="secondary">
          <BubbleContent>Want me to remove it now?</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent>Yes, clean that up.</BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent>Then rerun the registry build.</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  </Example>

{/snippet}

<ExampleWrapper>
  {@render BubbleSizes()}
  {@render BubbleVariants()}
  {@render BubbleAlignment()}
  {@render BubbleGrouped()}
</ExampleWrapper>
