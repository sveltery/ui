<script lang="ts">
  import { Field as Primitive, type FieldItemProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { class: classProp, orientation = 'horizontal', ...props }: FieldItemProps & FieldVariants = $props();
</script>
<Primitive.Item data-slot="field" data-orientation={orientation} {...props} class={cn(fieldVariants({ orientation }), classProp)} />
