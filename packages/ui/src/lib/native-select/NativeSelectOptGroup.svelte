<script lang="ts">
  import type { NativeSelectOptGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: NativeSelectOptGroupProps = $props();
</script>
<optgroup data-slot="native-select-optgroup" {...props} class={cn('bg-[Canvas] text-[CanvasText]', classProp)}>
  {@render children?.()}
</optgroup>
