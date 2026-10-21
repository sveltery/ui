<script lang="ts">
  import { RadioGroup as Primitive, type RadioGroupProps } from '@sveltery/base/radio-group';
  import { cn } from 'cn';
  let { children, class: classProp, value = $bindable(), ...props }: RadioGroupProps = $props();
</script>
<Primitive data-slot="radio-group" bind:value {...props} class={cn('cn-radio-group m-0 w-full min-w-0 border-0 p-0', classProp)}>
  {@render children?.()}
</Primitive>
