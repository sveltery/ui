<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity';
  import { fly } from 'svelte/transition';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import type { BubbleProps } from '$registry/bases/base/ui/bubble';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import { MessageScrollerItem } from '$registry/bases/base/ui/message-scroller';
  import { animations, type AnimationId } from './animations.js';
  import type { ChatMessage } from './chat.svelte.js';
  import MessageText from './MessageText.svelte';

  type Variant = NonNullable<BubbleProps['variant']>;
  let {
    message,
    scrollAnchor = false,
    animation = 'rise',
    userVariant = 'default',
    assistantVariant = 'muted',
  }: { message: ChatMessage; scrollAnchor?: boolean; animation?: AnimationId; userVariant?: Variant; assistantVariant?: Variant } = $props();

  const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');
  const isUser = $derived(message.role === 'user');
  // Only the sent message enters with motion, and only transform and opacity move so row measurement stays stable.
  const entrance = $derived(isUser && !reducedMotion.current ? animations[animation].fly : { duration: 0 });
</script>

<MessageScrollerItem messageId={message.id} {scrollAnchor}>
  <div in:fly={entrance}>
    <Message align={isUser ? 'end' : 'start'}>
      <MessageContent>
        <Bubble variant={isUser ? userVariant : assistantVariant}>
          <BubbleContent class="space-y-2">
            <MessageText text={message.text} />
          </BubbleContent>
        </Bubble>
      </MessageContent>
    </Message>
  </div>
</MessageScrollerItem>
