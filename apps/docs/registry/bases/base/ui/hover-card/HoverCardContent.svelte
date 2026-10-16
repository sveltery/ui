<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { PreviewCard as Primitive } from '@sveltery/base/preview-card';
  import { cn } from 'cn';
  let {
    children,
    class: classProp,
    align = 'center',
    alignOffset = 4,
    side = 'bottom',
    sideOffset = 4,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset'> = $props();
</script>
<Primitive.Portal data-slot="hover-card-portal">
  <Primitive.Positioner {align} {alignOffset} {side} {sideOffset} class="isolate z-50">
    <Primitive.Popup data-slot="hover-card-content" {...props} class={cn('cn-hover-card-content cn-hover-card-content-logical z-50 origin-(--transform-origin) outline-hidden', classProp)}>
      {@render children?.()}
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
