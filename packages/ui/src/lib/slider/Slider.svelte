<script lang="ts">
  import { Slider as Primitive } from '@sveltery/base/slider';
  import { cn } from 'cn';
  import type { SliderProps } from './types.js';
  let { value = $bindable(), defaultValue, min = 0, max = 100, class: classProp, ...props }: SliderProps = $props();
  const values = $derived(Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]);
</script>
<Primitive.Root data-slot="slider" {defaultValue} bind:value {min} {max} thumbAlignment="edge" {...props} class={cn('data-horizontal:w-full data-vertical:h-full', classProp)}>
  <Primitive.Control class="cn-slider relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col">
    <Primitive.Track data-slot="slider-track" class="cn-slider-track relative grow overflow-hidden select-none">
      <Primitive.Indicator data-slot="slider-range" class="cn-slider-range select-none data-horizontal:h-full data-vertical:w-full" />
    </Primitive.Track>
    {#each { length: values.length } as _, index (index)}
      <Primitive.Thumb data-slot="slider-thumb" class="cn-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50" />
    {/each}
  </Primitive.Control>
</Primitive.Root>
