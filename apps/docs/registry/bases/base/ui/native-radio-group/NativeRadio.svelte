<script lang="ts">
  import type { NativeRadioProps } from './types.js';
  import { cn } from 'cn';
  let { class: classProp, ...props }: NativeRadioProps = $props();
</script>
<input
  type="radio"
  data-slot="native-radio"
  {...props}
  class={cn('cn-native-radio peer relative aspect-square shrink-0 appearance-none border outline-none disabled:cursor-not-allowed disabled:opacity-50', classProp)}
/>
