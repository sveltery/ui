<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  import SelectScrollDownButton from './SelectScrollDownButton.svelte';
  import SelectScrollUpButton from './SelectScrollUpButton.svelte';
  let {
    children,
    class: classProp,
    side = 'bottom',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    alignItemWithTrigger = true,
    ...props
  }: ComponentProps<typeof Primitive.Popup> & Pick<ComponentProps<typeof Primitive.Positioner>, 'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'> = $props();
</script>
<Primitive.Portal>
  <Primitive.Positioner {side} {sideOffset} {align} {alignOffset} {alignItemWithTrigger} class="isolate z-50">
    <Primitive.Popup
      data-slot="select-content"
      data-align-trigger={alignItemWithTrigger}
      {...props}
      class={cn('cn-select-content cn-select-content-logical cn-menu-target cn-menu-translucent relative isolate z-50 max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-x-hidden overflow-y-auto data-[align-trigger=true]:animate-none', classProp)}
    >
      <SelectScrollUpButton />
      <Primitive.List>{@render children?.()}</Primitive.List>
      <SelectScrollDownButton />
    </Primitive.Popup>
  </Primitive.Positioner>
</Primitive.Portal>
