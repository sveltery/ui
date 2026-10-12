<script lang="ts">
  import { ScrollArea as Primitive, type ScrollAreaScrollbarProps } from '@sveltery/base/scroll-area';
  import { cn } from 'cn';
  let { class: classProp, orientation = 'vertical', ...props }: Omit<ScrollAreaScrollbarProps, 'children'> = $props();
</script>
<Primitive.Scrollbar
  data-slot="scroll-area-scrollbar"
  data-orientation={orientation}
  {orientation}
  {...props}
  class={cn('cn-scroll-area-scrollbar flex touch-none p-px transition-colors select-none', classProp)}
>
  <Primitive.Thumb data-slot="scroll-area-thumb" class="cn-scroll-area-thumb relative flex-1 bg-border" />
</Primitive.Scrollbar>
