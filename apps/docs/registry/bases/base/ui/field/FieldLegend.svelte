<script lang="ts">
  import { Fieldset as Primitive, type FieldsetLegendProps } from '@sveltery/base/fieldset';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, variant = 'legend', ...props }: FieldsetLegendProps & { variant?: 'legend' | 'label' } = $props();
</script>
<Primitive.Legend {children} {...props}>
  {#snippet render(legend, _state, content)}
    <legend {...legend as HTMLAttributes<HTMLLegendElement>} data-slot="field-legend" data-variant={variant} class={cn('cn-field-legend', classProp)}>{@render content?.()}</legend>
  {/snippet}
</Primitive.Legend>
