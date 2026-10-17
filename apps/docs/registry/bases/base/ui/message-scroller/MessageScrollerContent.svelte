<script lang="ts">
  import { Content } from '@sveltery/svelte/message-scroller';
  import { cn } from 'cn';
  import type { MessageScrollerContentProps } from './types.js';
  let { class: classProp, children, ...props }: MessageScrollerContentProps = $props();
</script>
<Content data-slot="message-scroller-content" {...props} class={cn('cn-message-scroller-content flex h-max min-h-full flex-col', classProp)}>
  {@render children?.()}
</Content>
