<script lang="ts">
  import { ScrollArea as Primitive, type ScrollAreaRootProps } from '@sveltery/base/scroll-area';
  import { cn } from 'cn';
  import ScrollBar from './ScrollBar.svelte';
  let { children, class: classProp, ...props }: ScrollAreaRootProps = $props();
</script>
<Primitive.Root data-slot="scroll-area" {...props} class={cn('cn-scroll-area relative', classProp)}>
  <Primitive.Viewport
    data-slot="scroll-area-viewport"
    class="cn-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
  >
    {@render children?.()}
  </Primitive.Viewport>
  <ScrollBar />
  <Primitive.Corner />
</Primitive.Root>
