<script lang="ts">
  import { Textarea as Primitive } from '@sveltery/base/textarea';
  import { cn } from 'cn';
  import type { TextareaProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: TextareaProps = $props();
</script>
<Primitive data-slot="textarea" {...props} bind:value class={cn('cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', classProp)} />
