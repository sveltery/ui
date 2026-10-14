<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    alignOffset = 0,
    anchor,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'anchor' | 'side' | 'sideOffset'> = $props();
</script>

<Primitive.Portal>
  <Primitive.Positioner {side} {sideOffset} {align} {alignOffset} {anchor} class="isolate z-50">
    <Primitive.Popup
      data-slot="combobox-content"
      data-chips={!!anchor}
      {...props}
      class={cn('cn-combobox-content cn-combobox-content-logical cn-menu-target cn-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)', classProp)}
    >
      {@render children?.()}
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
