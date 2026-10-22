<script lang="ts">
  import { Fieldset as Primitive, type FieldsetRootProps } from '@sveltery/base/fieldset';
  import { cn } from 'cn';
  let { class: classProp, ...props }: FieldsetRootProps = $props();
</script>
<Primitive.Root data-slot="field-set" {...props} class={cn('cn-field-set flex flex-col', classProp)} />
