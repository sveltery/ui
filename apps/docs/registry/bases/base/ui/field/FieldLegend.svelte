<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, variant = 'legend', ...props }: HTMLAttributes<HTMLLegendElement> & { variant?: 'legend' | 'label' } = $props();
</script>
<legend data-slot="field-legend" data-variant={variant} {...props} class={cn('cn-field-legend', classProp)}>
  {@render children?.()}
</legend>
