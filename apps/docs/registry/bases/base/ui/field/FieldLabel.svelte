<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  import { Label } from '../label/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Label> & Pick<HTMLLabelAttributes, 'for'> = $props();
</script>
<Primitive.Label {children} {...props}>
  {#snippet render(label, _state, content)}
    <Label {...label} data-slot="field-label" class={cn('cn-field-label group/field-label peer/field-label flex w-fit', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col', classProp)}>{@render content?.()}</Label>
  {/snippet}
</Primitive.Label>
