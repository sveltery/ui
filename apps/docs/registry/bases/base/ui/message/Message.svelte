<script lang="ts">
  import type { MessageProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, align = 'start', ...props }: MessageProps = $props();
</script>
<div data-slot="message" data-align={align} {...props} class={cn('cn-message group/message relative flex w-full min-w-0 data-[align=end]:flex-row-reverse', classProp)}>
  {@render children?.()}
</div>
