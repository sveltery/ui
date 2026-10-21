<script lang="ts">
  import { Slider as Primitive } from '@sveltery/base/slider';
  import { cn } from 'cn';
  import type { SliderProps } from './types.js';
  let { value = $bindable(), defaultValue, min = 0, max = 100, class: classProp, host, ...props }: SliderProps = $props();
  const current = $derived(value ?? defaultValue);
  const thumbs = $derived(Array.isArray(current) ? current.length : 1);
</script>
<Primitive.Root {defaultValue} bind:value {min} {max} thumbAlignment="edge" {...props} host={{ ...host, 'data-slot': 'slider' }} class={cn('data-horizontal:w-full data-vertical:h-full', classProp)}>
  <Primitive.Control class="cn-slider relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col">
    <Primitive.Track data-slot="slider-track" class="cn-slider-track relative grow overflow-hidden select-none">
      <Primitive.Indicator data-slot="slider-range" class="cn-slider-range select-none data-horizontal:h-full data-vertical:w-full" />
    </Primitive.Track>
    {#each { length: thumbs } as _, index (index)}
      <Primitive.Thumb host={{ 'data-slot': 'slider-thumb' }} class="cn-slider-thumb block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50" />
    {/each}
  </Primitive.Control>
</Primitive.Root>
