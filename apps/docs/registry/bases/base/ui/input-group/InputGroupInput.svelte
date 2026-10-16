<script lang="ts">
  import { cn } from 'cn';
  import { Input } from '../input/index.js';
  import type { InputGroupInputProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: InputGroupInputProps = $props();
</script>
<Input data-slot="input-group-control" {...props} class={cn('cn-input-group-input flex-1', classProp)} bind:value />
