<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { class: classProp, value = $bindable(), ...props }: HTMLTextareaAttributes = $props();
</script>
<textarea data-slot="textarea" {...props} class={cn('cn-textarea flex field-sizing-content min-h-16 w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', classProp)} bind:value></textarea>
