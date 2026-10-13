<script lang="ts">
  import { Field as Primitive, type FieldItemProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { setInField } from './context.js';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { children, class: classProp, orientation = 'horizontal', ...props }: FieldItemProps & FieldVariants = $props();
  setInField();
</script>
<Primitive.Item role="group" data-slot="field" data-orientation={orientation} {children} {...props} class={cn(fieldVariants({ orientation }), classProp)} />
