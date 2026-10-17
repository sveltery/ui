<script lang="ts">
  import { useMessageScroller } from './scroller.svelte.js';
  import type { MessageScrollerViewportProps } from './types.js';

  let { preserveScrollOnPrepend = true, role = 'region', 'aria-label': ariaLabel = 'Messages', tabindex = 0, children, ...rest }: MessageScrollerViewportProps = $props();
  const scroller = useMessageScroller();
</script>

<!-- The viewport is a focusable scroll region so keyboard users can scroll the transcript. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div {...rest} {role} aria-label={ariaLabel} {tabindex} {...scroller.stateAttributes} {@attach scroller.viewport(() => preserveScrollOnPrepend)}>
  {@render children?.()}
</div>
