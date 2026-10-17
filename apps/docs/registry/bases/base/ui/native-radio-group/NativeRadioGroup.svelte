<script lang="ts">
  import type { NativeRadioGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: NativeRadioGroupProps = $props();
</script>
<div role="radiogroup" data-slot="native-radio-group" {...props} class={cn('cn-radio-group w-full', classProp)}>
  {@render children?.()}
</div>
