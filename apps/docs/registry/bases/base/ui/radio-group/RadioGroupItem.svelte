<script lang="ts">
  import { Radio as Primitive, type RadioRootProps } from '@sveltery/base/radio';
  import { cn } from 'cn';
  let { class: classProp, ...props }: Omit<RadioRootProps, 'children'> = $props();
</script>
<Primitive.Root
  data-slot="radio-group-item"
  {...props}
  class={cn('cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50', classProp)}
>
  <Primitive.Indicator data-slot="radio-group-indicator" class="cn-radio-group-indicator">
    <span class="cn-radio-group-indicator-icon"></span>
  </Primitive.Indicator>
</Primitive.Root>
