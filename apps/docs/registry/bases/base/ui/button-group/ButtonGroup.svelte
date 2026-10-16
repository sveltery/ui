<script lang="ts">
  import type { ButtonGroupProps } from './types.js';
  import { cn } from 'cn';
  import { buttonGroupVariants } from './variants.js';
  let { children, class: classProp, orientation, ...props }: ButtonGroupProps = $props();
</script>
<div role="group" data-slot="button-group" data-orientation={orientation} {...props} class={cn(buttonGroupVariants({ orientation }), classProp)}>
  {@render children?.()}
</div>
