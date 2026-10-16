<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  let { class: classProp, side = 'bottom', sideOffset = 8, align = 'start', alignOffset = 0, ...props }: ComponentProps<typeof Primitive.Positioner> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {side} {sideOffset} {align} {alignOffset} {...props} class={cn('cn-navigation-menu-positioner isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] data-instant:transition-none', classProp)}>
    <Primitive.Popup class="cn-navigation-menu-popup data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]">
      <Primitive.Viewport class="relative size-full overflow-hidden" />
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
