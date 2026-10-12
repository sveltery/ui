<script lang="ts">
  import { ToggleGroup as Primitive } from '@sveltery/base/toggle-group';
  import { cn } from 'cn';
  import { setToggleGroupContext } from './context.js';
  import type { ToggleGroupProps } from './types.js';
  let { value = $bindable(), class: classProp, variant, size, spacing = 2, children, ...props }: ToggleGroupProps = $props();
  setToggleGroupContext({
    get variant() { return variant; },
    get size() { return size; },
    get spacing() { return spacing; },
  });
</script>
<Primitive
  data-slot="toggle-group"
  data-variant={variant}
  data-size={size}
  data-spacing={spacing}
  style="--gap: {spacing}"
  bind:value
  {...props}
  class={cn('cn-toggle-group group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch', classProp)}
>
  {@render children?.()}
</Primitive>
