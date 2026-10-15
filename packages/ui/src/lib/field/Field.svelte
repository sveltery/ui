<script lang="ts" generics="F extends FieldHandle = FieldHandle">
  import { Field as Primitive } from '@sveltery/base/field';
  import type { FieldHandle } from '@sveltery/base/form';
  import { cn } from 'cn';
  import { fieldVariants } from './variants.js';
  import type { FieldProps } from './types.js';
  let { children, class: classProp, orientation = 'vertical', ...props }: FieldProps<F> = $props();
</script>
<Primitive.Root {children} {...props}>
  {#snippet render(root, state, content)}
    <!-- shadcn styles `data-[invalid=true]` and `data-[disabled=true]`, so Base's state writes "true". -->
    <div {...root} role="group" data-slot="field" data-orientation={orientation} data-invalid={state.valid === false ? 'true' : root['data-invalid']} data-disabled={state.disabled ? 'true' : root['data-disabled']} class={cn(fieldVariants({ orientation }), classProp)}>{@render content?.()}</div>
  {/snippet}
</Primitive.Root>
