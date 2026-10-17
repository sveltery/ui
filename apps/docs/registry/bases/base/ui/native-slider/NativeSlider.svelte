<script lang="ts">
  import type { NativeSliderProps } from './types.js';
  import { cn } from 'cn';
  let { class: classProp, ...props }: NativeSliderProps = $props();
</script>
<!-- The track fill is native only in Firefox (::-moz-range-progress); filling it elsewhere would need script. -->
<input type="range" data-slot="slider" {...props} class={cn('cn-native-slider m-0 w-full min-w-0 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50', classProp)} />
