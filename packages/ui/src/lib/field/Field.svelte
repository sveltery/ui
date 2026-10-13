<script lang="ts" generics="F extends FieldHandle = FieldHandle">
  import { Field as Primitive } from '@sveltery/base/field';
  import type { FieldHandle } from '@sveltery/base/form';
  import { cn } from 'cn';
  import { fieldVariants } from './variants.js';
  import type { FieldProps } from './types.js';
  let { children, class: classProp, orientation = 'vertical', ...props }: FieldProps<F> = $props();
</script>
<Primitive.Root role="group" data-slot="field" data-orientation={orientation} {children} {...props} class={cn(fieldVariants({ orientation }), classProp)} />
