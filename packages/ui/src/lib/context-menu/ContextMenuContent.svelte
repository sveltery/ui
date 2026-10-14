<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    align = 'start',
    alignOffset = 4,
    side = 'right',
    sideOffset = 0,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset'> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {align} {alignOffset} {side} {sideOffset} class="isolate z-50 outline-none">
    <Primitive.Popup data-slot="context-menu-content" {...props} class={cn('cn-context-menu-content cn-context-menu-content-logical cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none', classProp)}>
      {@render children?.()}
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
