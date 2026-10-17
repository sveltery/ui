<script lang="ts">
  import { Bubble, BubbleContent, BubbleGroup } from '$registry/bases/base/ui/bubble';
  import { toast } from '$registry/bases/base/ui/toast';
</script>

<div class="flex w-full max-w-sm flex-col gap-8 py-12">
  <Bubble variant="muted">
    <BubbleContent>How can I help you today?</BubbleContent>
  </Bubble>
  <BubbleGroup>
    <Bubble variant="tinted" align="end">
      <BubbleContent>
        {#snippet render(props, _state, content)}
          <button {...props} onclick={() => toast.add({ title: 'You clicked forgot password' })}>{@render content?.()}</button>
        {/snippet}
        I forgot my password
      </BubbleContent>
    </Bubble>
    <Bubble variant="tinted" align="end">
      <BubbleContent>
        {#snippet render(props, _state, content)}
          <button {...props} onclick={() => toast.add({ title: 'You clicked help with subscription' })}>{@render content?.()}</button>
        {/snippet}
        I need help with my subscription
      </BubbleContent>
    </Bubble>
    <Bubble variant="tinted" align="end">
      <BubbleContent>
        {#snippet render(props, _state, content)}
          <button {...props} onclick={() => toast.add({ title: 'You clicked something else. Talk to a human.' })}>{@render content?.()}</button>
        {/snippet}
        Something else. Talk to a human.
      </BubbleContent>
    </Bubble>
  </BubbleGroup>
</div>
