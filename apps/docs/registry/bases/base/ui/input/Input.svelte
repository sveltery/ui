<script lang="ts">
  import { Input as Primitive } from '@sveltery/base/input';
  import type { InputProps } from '@sveltery/base/input';
  import { cn } from 'cn';
  let { class: classProp, value = $bindable(), ...props }: InputProps = $props();
</script>
<Primitive data-slot="input" {...props} class={cn('cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50', classProp)} bind:value />
