<script lang="ts">
  import type { TraceCollapsibleContentProps } from './types.js';
  import { cn } from 'cn';
  import { CollapsibleContent } from '../collapsible/index.js';
  let { children, class: classProp, ...props }: TraceCollapsibleContentProps = $props();
</script>
<CollapsibleContent
  data-slot="trace-collapsible-content"
  class="cn-trace-collapsible-content h-(--collapsible-panel-height) min-w-0 overflow-hidden transition-[height] data-ending-style:h-0 data-starting-style:h-0"
  {...props}
>
  <div data-slot="trace-collapsible-content-inner" class={cn('cn-trace-collapsible-content-inner min-w-0 wrap-break-word text-muted-foreground', classProp)}>
    {@render children?.()}
  </div>
</CollapsibleContent>
