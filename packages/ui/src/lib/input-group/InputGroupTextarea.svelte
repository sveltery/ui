<script lang="ts">
  import { cn } from 'cn';
  import { Textarea } from '../textarea/index.js';
  import type { InputGroupTextareaProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: InputGroupTextareaProps = $props();
</script>
<Textarea data-slot="input-group-control" {...props} class={cn('cn-input-group-textarea flex-1 resize-none', classProp)} bind:value />
