<script lang="ts">
  import type { NativeRadioGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: NativeRadioGroupProps = $props();
</script>
<div role="radiogroup" data-slot="radio-group" {...props} class={cn('cn-native-radio-group w-full', classProp)}>
  {@render children?.()}
</div>
