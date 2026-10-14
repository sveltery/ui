<script lang="ts">
  import { cn } from 'cn';
  import { fieldVariants } from './variants.js';
  import type { FieldProps } from './types.js';
  let { children, class: classProp, orientation = 'vertical', ...props }: FieldProps = $props();
</script>
<div role="group" data-slot="field" data-orientation={orientation} {...props} class={cn(fieldVariants({ orientation }), classProp)}>
  {@render children?.()}
</div>
