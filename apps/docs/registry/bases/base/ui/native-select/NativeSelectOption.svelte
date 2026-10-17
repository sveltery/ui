<script lang="ts">
  import type { NativeSelectOptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: NativeSelectOptionProps = $props();
</script>
<option data-slot="native-select-option" {...props} class={cn('bg-[Canvas] text-[CanvasText] in-[select[multiple]]:rounded-sm in-[select[multiple]]:bg-transparent in-[select[multiple]]:px-1 in-[select[multiple]]:text-foreground in-[select[multiple]]:checked:bg-muted', classProp)}>
  {@render children?.()}
</option>
