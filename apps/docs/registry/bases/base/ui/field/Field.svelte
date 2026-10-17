<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { children, class: classProp, orientation = 'vertical', ...props }: HTMLAttributes<HTMLDivElement> & FieldVariants = $props();
</script>
<div role="group" data-slot="field" data-orientation={orientation} {...props} class={cn(fieldVariants({ orientation }), classProp)}>
  {@render children?.()}
</div>
