<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Popover as Primitive } from '@sveltery/base/popover';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    align = 'center',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset'> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {align} {alignOffset} {side} {sideOffset} class="isolate z-50">
    <Primitive.Popup data-slot="popover-content" {...props} class={cn('cn-popover-content cn-popover-content-logical z-50 w-72 origin-(--transform-origin) outline-hidden', classProp)}>
      {@render children?.()}
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
