<script lang="ts">
  import CopyIcon from '@lucide/svelte/icons/copy';
  import RefreshCcwIcon from '@lucide/svelte/icons/refresh-ccw';
  import ThumbsDownIcon from '@lucide/svelte/icons/thumbs-down';
  import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';
  import { Bubble, BubbleContent } from '$registry/bases/base/ui/bubble';
  import { Button } from '$registry/bases/base/ui/button';
  import { Message, MessageContent, MessageFooter } from '$registry/bases/base/ui/message';
</script>

<div class="flex w-full max-w-sm flex-col gap-8 py-12">
  <Message>
    <MessageContent>
      <Bubble variant="muted">
        <BubbleContent>The install failure is coming from the workspace package.</BubbleContent>
      </Bubble>
      <MessageFooter>
        <Button variant="ghost" size="icon" aria-label="Copy" title="Copy">
          <CopyIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Like" title="Like">
          <ThumbsUpIcon />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Dislike" title="Dislike">
          <ThumbsDownIcon />
        </Button>
      </MessageFooter>
    </MessageContent>
  </Message>
  <Message align="end">
    <MessageContent>
      <Bubble>
        <BubbleContent>Okay drop me a link. Taking a look...</BubbleContent>
      </Bubble>
      <MessageFooter class="gap-2">
        <span class="font-normal text-destructive">Failed to send</span>
        <Button variant="ghost" size="icon-xs" title="Retry" aria-label="Retry">
          <RefreshCcwIcon />
        </Button>
      </MessageFooter>
    </MessageContent>
  </Message>
</div>
