<script lang="ts">
  import { Field as Primitive, type FieldItemProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { fieldVariants, type FieldVariants } from './variants.js';
  let { children, class: classProp, orientation = 'horizontal', ...props }: FieldItemProps & FieldVariants = $props();
</script>
<Primitive.Item {children} {...props}>
  {#snippet render(item, state, content)}
    <!-- shadcn styles `data-[invalid=true]` and `data-[disabled=true]`, so Base's state writes "true". -->
    <div {...item} role="group" data-slot="field" data-orientation={orientation} data-invalid={state.valid === false ? 'true' : item['data-invalid']} data-disabled={state.disabled ? 'true' : item['data-disabled']} class={cn(fieldVariants({ orientation }), classProp)}>{@render content?.()}</div>
  {/snippet}
</Primitive.Item>
