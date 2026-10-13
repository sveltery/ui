<script lang="ts">
  import { Fieldset as Primitive, type FieldsetLegendProps } from '@sveltery/base/fieldset';
  import { cn } from 'cn';
  let { children, class: classProp, variant = 'legend', ...props }: FieldsetLegendProps & { variant?: 'legend' | 'label' } = $props();
</script>
<Primitive.Legend data-slot="field-legend" data-variant={variant} {children} {...props} class={cn('cn-field-legend', classProp)} />
