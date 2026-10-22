<script lang="ts">
  import { Field as Primitive, type FieldRootProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { class: classProp, orientation = 'vertical', ...props }: FieldRootProps & FieldVariants = $props();
</script>
<Primitive.Root role="group" data-slot="field" data-orientation={orientation} {...props} class={cn(fieldVariants({ orientation }), classProp)} />
