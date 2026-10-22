<script lang="ts">
  import { Field as Primitive, type FieldDescriptionProps } from '@sveltery/base/field';
  import { cn } from 'cn';
  let { class: classProp, ...props }: FieldDescriptionProps = $props();
</script>
<Primitive.Description data-slot="field-description" {...props} class={cn('cn-field-description leading-normal font-normal group-has-data-horizontal/field:text-balance', 'last:mt-0 nth-last-2:-mt-1', '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)} />
