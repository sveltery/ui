<script lang="ts">
  import { Bubble, BubbleContent, BubbleReactions } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { toast } from '$registry/bases/base/ui/toast';
</script>

<div class="flex w-full max-w-sm flex-col gap-12 py-12">
  <Bubble variant="muted" align="end">
    <BubbleContent>
      I don't need tests, I know my code works.
    </BubbleContent>
    <BubbleReactions align="start" role="img" aria-label="Reactions: thumbs up, surprised">
      <span>👍</span>
      <span>😮</span>
    </BubbleReactions>
  </Bubble>
  <Bubble variant="muted">
    <BubbleContent>
      Bold. Fine I'll add some tests. I'll let you know when
      they're done.
    </BubbleContent>
    <BubbleReactions role="img" aria-label="Reactions: eyes, rocket, and 2 more">
      <span>👀</span>
      <span>🚀</span>
      <span>+2</span>
    </BubbleReactions>
  </Bubble>
  <Bubble variant="default" align="end">
    <BubbleContent>
      Tests passed on the first try. All 142 of them. Looking good!
    </BubbleContent>
    <BubbleReactions side="top" align="start" role="img" aria-label="Reactions: party popper, clapping hands">
      <span>🎉</span>
      <span>👏</span>
    </BubbleReactions>
  </Bubble>
  <Bubble variant="destructive">
    <BubbleContent>Are you sure I can run this command?</BubbleContent>
    <BubbleReactions>
      <Button variant="ghost" size="xs" onclick={() => toast.add({ title: 'You clicked yes, running command...', type: 'success' })}>
        Yes, run it
      </Button>
    </BubbleReactions>
  </Bubble>
</div>
