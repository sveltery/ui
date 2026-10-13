<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    align = 'start',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset'> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {align} {alignOffset} {side} {sideOffset} class="isolate z-50 outline-none">
    <Primitive.Popup data-slot="dropdown-menu-content" {...props} class={cn('cn-dropdown-menu-content cn-dropdown-menu-content-logical cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none data-closed:overflow-hidden', classProp)}>
      {@render children?.()}
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
