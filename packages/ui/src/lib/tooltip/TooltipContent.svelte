<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Tooltip as Primitive } from '@sveltery/base/tooltip';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    align = 'center',
    alignOffset = 0,
    side = 'top',
    sideOffset = 4,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset'> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {align} {alignOffset} {side} {sideOffset} class="isolate z-50">
    <Primitive.Popup data-slot="tooltip-content" {...props} class={cn('cn-tooltip-content cn-tooltip-content-logical z-50 w-fit max-w-xs origin-(--transform-origin) bg-foreground text-background', classProp)}>
      {@render children?.()}
      <Primitive.Arrow class="cn-tooltip-arrow cn-tooltip-arrow-logical z-50 bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
