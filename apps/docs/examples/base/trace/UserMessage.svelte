<script lang="ts">
  import type { UIMessage } from 'ai';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Message, MessageContent } from '$registry/bases/base/ui/message';
  import { getMessageText } from './message-text.js';

  let { message }: { message: UIMessage } = $props();
</script>

<Message align="end">
  <MessageContent>
    <Bubble align="end" variant="muted">
      <BubbleContent>{getMessageText(message)}</BubbleContent>
    </Bubble>
  </MessageContent>
</Message>
