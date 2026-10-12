<script lang="ts">
  import type { NativeSelectOptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: NativeSelectOptionProps = $props();
</script>
<option data-slot="native-select-option" {...props} class={cn('bg-[Canvas] text-[CanvasText]', classProp)}>
  {@render children?.()}
</option>
