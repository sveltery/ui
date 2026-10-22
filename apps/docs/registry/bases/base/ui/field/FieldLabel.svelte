<script lang="ts">
  import { Field as Primitive, type FieldLabelProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { Label } from '../label/index.js';
  let { class: classProp, ...props }: FieldLabelProps = $props();
</script>
<Primitive.Label {...props}>
  {#snippet render(labelProps, _state, content)}
    <Label data-slot="field-label" {...labelProps} class={cn('cn-field-label group/field-label peer/field-label flex w-fit', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col', classProp)}>{@render content?.()}</Label>
  {/snippet}
</Primitive.Label>
