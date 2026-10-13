<script lang="ts">
  import { Field as Primitive, type FieldItemProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { children, class: classProp, orientation = 'horizontal', ...props }: FieldItemProps & FieldVariants = $props();
</script>
<Primitive.Item role="group" data-slot="field" data-orientation={orientation} {children} {...props} class={cn(fieldVariants({ orientation }), classProp)} />
