<script lang="ts">
  import { RadioGroup as Primitive, type RadioGroupProps } from '@sveltery/base/radio-group';
  import { cn } from 'cn';
  let { children, class: classProp, value = $bindable(), ...props }: RadioGroupProps = $props();
</script>
<Primitive data-slot="radio-group" bind:value {...props} class={cn('cn-radio-group w-full', classProp)}>
  {@render children?.()}
</Primitive>
