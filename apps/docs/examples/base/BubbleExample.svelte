<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from '@sveltery/ui/bubble';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Marker, MarkerContent } from '@sveltery/ui/marker';

  const quickReplies = [
    'I need help with my account.',
    'I forgot my password.',
    "I have another question. I'd like to talk to a human. Can you help me?",
  ];
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

{#snippet BubbleButtonLinks()}
  <Example title="Button & Links">
    <div class="flex w-full max-w-md flex-col gap-8">
      <Bubble>
        <BubbleContent>
          {#snippet render(props, _state, children)}
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a {...props} href="#">{@render children?.()}</a>
          {/snippet}
          This bubble is a link.
        </BubbleContent>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>
          {#snippet render(props, _state, children)}
            <button {...props} type="button">{@render children?.()}</button>
          {/snippet}
          This one is a button you can click.
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          {#snippet render(props, _state, children)}
            <button {...props} type="button">{@render children?.()}</button>
          {/snippet}
          You can also do tinted buttons. Even ones that are multilines.
        </BubbleContent>
      </Bubble>
      <Marker variant="separator">
        <MarkerContent>Chat Suggestions</MarkerContent>
      </Marker>
      <Bubble>
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        {#each quickReplies as reply (reply)}
          <Bubble variant="outline" align="end">
            <BubbleContent class="border-dashed border-primary">
              {#snippet render(props, _state, children)}
                <button {...props} type="button">{@render children?.()}</button>
              {/snippet}
              {reply}
            </BubbleContent>
          </Bubble>
        {/each}
      </BubbleGroup>
    </div>
  </Example>
{/snippet}

{#snippet BubbleWithReactions()}
  <Example title="Reaction Placement">
    <div class="flex w-full max-w-md flex-col gap-12">
      <Marker variant="separator">
        <MarkerContent>side=bottom align=end</MarkerContent>
      </Marker>
      <Bubble>
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions
          side="bottom"
          align="end"
          role="img"
          aria-label="Reaction: thumbs up"
        >
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="secondary" align="end">
        <BubbleContent>
          A longer message that wraps across lines so the reaction offset is
          easier to inspect.
        </BubbleContent>
        <BubbleReactions
          side="bottom"
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised"
        >
          <span>👍</span>
          <span>😮</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted">
        <BubbleContent>
          A longer message that wraps across lines so the reaction offset is
          easier to inspect.
        </BubbleContent>
        <BubbleReactions
          side="bottom"
          align="end"
          role="img"
          aria-label="Reactions: thumbs up, surprised, fire, eyes, and 8 more"
        >
          <span>👍</span>
          <span>😮</span>
          <span>🔥</span>
          <span>👀</span>
          <span>+8</span>
        </BubbleReactions>
      </Bubble>
      <Marker variant="separator">
        <MarkerContent>side=bottom align=start</MarkerContent>
      </Marker>
      <Bubble variant="secondary">
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions
          side="bottom"
          align="start"
          role="img"
          aria-label="Reaction: fire"
        >
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>
          A longer message that wraps across lines so the reaction offset is
          easier to inspect.
        </BubbleContent>
        <BubbleReactions
          side="bottom"
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised, fire, eyes"
        >
          <span>👍</span>
          <span>😮</span>
          <span>🔥</span>
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
      <Marker variant="separator">
        <MarkerContent>side=top align=start</MarkerContent>
      </Marker>
      <Bubble variant="secondary">
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions
          side="top"
          align="start"
          role="img"
          aria-label="Reaction: fire"
        >
          <span>🔥</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="secondary">
        <BubbleContent>
          A longer message that wraps across lines so the reaction offset is
          easier to inspect.
        </BubbleContent>
        <BubbleReactions
          side="top"
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised, fire, eyes"
        >
          <span>👍</span>
          <span>😮</span>
          <span>🔥</span>
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
      <Marker variant="separator">
        <MarkerContent>side=bottom align=end</MarkerContent>
      </Marker>
      <Bubble variant="muted">
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions
          side="top"
          align="end"
          role="img"
          aria-label="Reaction: thumbs up"
        >
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>
          A longer message that wraps across lines so the reaction offset.
        </BubbleContent>
        <BubbleReactions
          side="top"
          align="end"
          role="img"
          aria-label="Reactions: thumbs up, surprised, fire, eyes"
          class="px-1.5 py-0.5"
        >
          <span>👍</span>
          <span>😮</span>
          <span>🔥</span>
          <span>👀</span>
        </BubbleReactions>
      </Bubble>
    </div>
  </Example>
{/snippet}

{#snippet BubbleReactionsButtons()}
  <Example title="Reactions Buttons">
    <div class="flex w-full max-w-md flex-col gap-8">
      <Bubble>
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions>
          <Button variant="outline" size="xs">Button</Button>
        </BubbleReactions>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>This is a one line message.</BubbleContent>
        <BubbleReactions align="start">
          <Button variant="ghost" size="icon-xs">🎉</Button>
        </BubbleReactions>
      </Bubble>
      <Bubble variant="tinted">
        <BubbleContent>
          We are going to the movies first then dinner. Are you in?
        </BubbleContent>
        <BubbleReactions class="gap-1 bg-background">
          <Button variant="secondary" size="icon-xs" aria-label="Thumbs up">
            <IconPlaceholder
              lucide="ThumbsUpIcon"
              tabler="IconThumbUp"
              hugeicons="ThumbsUpIcon"
              phosphor="ThumbsUpIcon"
              remixicon="RiThumbUpLine"
            />
          </Button>
          <Button variant="secondary" size="icon-xs" aria-label="Thumbs down">
            <IconPlaceholder
              lucide="ThumbsDownIcon"
              tabler="IconThumbDown"
              hugeicons="ThumbsDownIcon"
              phosphor="ThumbsDownIcon"
              remixicon="RiThumbDownLine"
            />
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render BubbleSizes()}
  {@render BubbleVariants()}
  {@render BubbleAlignment()}
  {@render BubbleGrouped()}
  {@render BubbleButtonLinks()}
  {@render BubbleWithReactions()}
  {@render BubbleReactionsButtons()}
</ExampleWrapper>
